(function initializeAniLane2Experience(global) {
  "use strict";

  function canonicalGenerationValue(value) {
    if (Array.isArray(value)) return value.map(canonicalGenerationValue);
    if (!value || typeof value !== "object") return value;
    return Object.keys(value).sort().reduce((result, key) => {
      if (value[key] !== undefined) result[key] = canonicalGenerationValue(value[key]);
      return result;
    }, {});
  }

  function generationFailureIsRetryable(error = {}) {
    const code = String(error.code || "").toLowerCase();
    const status = Number(error.status || 0);
    if (["generation_settlement_pending", "generation_settlement_reconciliation_required"].includes(code)) return true;
    if (!status) return true;
    return [408, 425, 429].includes(status) || status >= 500;
  }

  function createGenerationIdempotencyTracker(createKey) {
    if (typeof createKey !== "function") throw new TypeError("A generation idempotency-key factory is required.");
    let pending = null;

    const signatureFor = ({ account = "anonymous", pathname = "", body = {} } = {}) => JSON.stringify({
      account: String(account || "anonymous"),
      pathname: String(pathname || ""),
      body: canonicalGenerationValue(body)
    });

    const matchesPending = (submission) => Boolean(pending && submission
      && pending.key === submission.key && pending.signature === submission.signature);

    return Object.freeze({
      begin(details = {}) {
        const signature = signatureFor(details);
        if (pending?.retryable && pending.signature === signature) {
          pending.retryable = false;
          pending.attempts += 1;
          return { key: pending.key, signature, reused: true, attempts: pending.attempts };
        }
        pending = {
          key: String(createKey(details.layout || "standard")),
          signature,
          retryable: false,
          attempts: 1
        };
        return { key: pending.key, signature, reused: false, attempts: 1 };
      },
      fail(submission, error) {
        if (!matchesPending(submission)) return false;
        if (generationFailureIsRetryable(error)) {
          pending.retryable = true;
          return true;
        }
        pending = null;
        return false;
      },
      succeed(submission) {
        if (matchesPending(submission)) pending = null;
      },
      reset() {
        pending = null;
      },
      snapshot() {
        return pending ? { ...pending } : null;
      }
    });
  }

  if (global.ANI_AUTOMATED_TEST === true) {
    global.AniLane2ExperienceTestHooks = Object.freeze({ createGenerationIdempotencyTracker });
  }

  const bridge = global.AniLane2Bridge;
  const syncFactory = global.AniLane2Sync;
  if (!bridge || !syncFactory) return;

  const byId = (id) => document.getElementById(id);
  const elements = {
    panel: byId("lane2ExperiencePanel"),
    open: byId("onlineServicesButton"),
    close: byId("lane2CloseButton"),
    connection: byId("lane2ConnectionBadge"),
    status: byId("lane2ExperienceStatus"),
    recentAuthDialog: byId("lane2RecentAuthDialog"),
    recentAuthForm: byId("lane2RecentAuthForm"),
    recentAuthPassword: byId("lane2RecentAuthPassword"),
    recentAuthStatus: byId("lane2RecentAuthStatus"),
    recentAuthCancel: byId("lane2RecentAuthCancelButton"),
    recentAuthSubmit: byId("lane2RecentAuthSubmitButton"),
    accountMount: byId("lane2AccountMount"),
    profilePanel: byId("lane2ProfilePanel"),
    profileForm: byId("lane2ProfileForm"),
    profileName: byId("lane2ProfileName"),
    profileTimezone: byId("lane2ProfileTimezone"),
    profileLocale: byId("lane2ProfileLocale"),
    profileVersion: byId("lane2ProfileVersion"),
    passwordForm: byId("lane2PasswordForm"),
    sessionsRefresh: byId("lane2SessionsRefreshButton"),
    sessionsList: byId("lane2SessionsList"),
    sessionPolicy: byId("lane2SessionPolicy"),
    revokeOtherSessions: byId("lane2RevokeOtherSessionsButton"),
    deleteForm: byId("lane2DeleteAccountForm"),
    membershipHeading: byId("lane2MembershipHeading"),
    membershipRefresh: byId("lane2MembershipRefreshButton"),
    entitlementGrid: byId("lane2EntitlementGrid"),
    plans: byId("lane2PlansList"),
    pendingCheckout: byId("lane2PendingCheckout"),
    cancelSubscription: byId("lane2CancelSubscriptionButton"),
    paymentHistory: byId("lane2PaymentHistory"),
    generatorMode: byId("lane2GeneratorMode"),
    questionForm: byId("lane2QuestionForm"),
    questionTopic: byId("lane2QuestionTopic"),
    questionLayout: byId("lane2QuestionLayout"),
    questionDifficulty: byId("lane2QuestionDifficulty"),
    reuseCached: byId("lane2ReuseCached"),
    generate: byId("lane2GenerateButton"),
    generatedActions: byId("lane2GeneratedActions"),
    generatedSummary: byId("lane2GeneratedSummary"),
    saveQuestion: byId("lane2SaveQuestionButton"),
    syncNow: byId("lane2SyncNowButton"),
    syncSummary: byId("lane2SyncSummary"),
    savedQuestions: byId("lane2SavedQuestions"),
    studyHistory: byId("lane2StudyHistory"),
    conflicts: byId("lane2SyncConflicts"),
    adminTabButton: byId("lane2AdminTabButton"),
    adminRefresh: byId("lane2AdminRefreshButton"),
    adminMetrics: byId("lane2AdminMetrics"),
    adminControls: byId("lane2AdminControls"),
    adminSearchForm: byId("lane2AdminUserSearchForm"),
    adminUserQuery: byId("lane2AdminUserQuery"),
    adminUsers: byId("lane2AdminUsers"),
    adminFailures: byId("lane2AdminFailures"),
    adminPayments: byId("lane2AdminPayments"),
    adminErrors: byId("lane2AdminErrors"),
    adminReview: byId("lane2AdminReviewQueue")
  };
  if (!elements.panel || !elements.open) return;

  const state = {
    user: bridge.getCurrentUser(),
    profile: null,
    sessions: [],
    sessionPolicy: null,
    entitlements: null,
    plans: [],
    payment: {},
    lastGenerated: null,
    pendingCheckout: null,
    savedQuestions: [],
    remoteRecords: [],
    adminSnapshot: null,
    adminUsers: [],
    recentAuthPrompt: null,
    loading: false,
    sync: null
  };

  const node = (tag, className = "", text = "") => {
    const value = document.createElement(tag);
    if (className) value.className = className;
    if (text !== "") value.textContent = String(text);
    return value;
  };

  const identifier = (prefix = "ani") => {
    const id = global.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    return `${prefix}-${id}`.slice(0, 160);
  };
  const generationIdempotency = createGenerationIdempotencyTracker(
    (layout) => identifier(`question-${String(layout || "standard")}`)
  );

  function accountId(user = state.user) {
    return user?.uuid || user?.user_uuid || user?.id || "anonymous";
  }

  function setStatus(message = "", error = false) {
    elements.status.textContent = String(message || "").slice(0, 500);
    elements.status.classList.toggle("error", Boolean(error));
  }

  function safeError(error, fallback = "ANI could not complete this online-service request.") {
    if (!global.navigator.onLine) return "You are offline. Local encyclopedia and study tools remain available; reconnect before retrying this online action.";
    if (error?.status === 401) return "Your session expired. Sign in again to continue.";
    if (error?.status === 402) return "Your AI allowance and purchased credits are not sufficient for this request.";
    if (error?.status === 429) return "ANI is limiting requests for safety. Wait briefly, then try again.";
    if (error?.code === "email_verification_required") return "Verify your email before using paid AI question generation.";
    if (error?.code === "profile_version_conflict") return "This profile changed on another device. Refresh it before saving again.";
    if (error?.code === "password_reauthentication_failed") return "The current password is incorrect.";
    if (error?.code === "recent_auth_required") return "Confirm your current password before making this sensitive change.";
    if (error?.code === "recent_authentication_failed") return "The current password is incorrect.";
    if (error?.code === "recent_auth_cancelled") return "Password confirmation was canceled. No changes were made.";
    if (error?.code === "session_expired") return "This session expired. Sign in again to continue.";
    if (error?.code === "generated_question_rejected") return "ANI rejected the generated question because it did not pass local format or safety validation. You were not charged for an approved question.";
    return String(error?.message || fallback).replace(/\s+/g, " ").slice(0, 400);
  }

  async function request(pathname, { method = "GET", body, headers = {} } = {}) {
    const options = { method, headers: { ...headers } };
    if (body !== undefined) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
    const result = await bridge.request(pathname, options);
    if (!result.ok) {
      const error = new Error(result.data?.error || "Online-service request failed.");
      error.status = result.status;
      error.code = result.data?.code || "lane2_request_failed";
      error.requestId = result.requestId;
      error.payload = result.data;
      throw error;
    }
    return { ...result.data, request_id: result.requestId || result.data?.request_id || "" };
  }

  function recentAuthCancellation(message = "Password confirmation was canceled.") {
    const error = new Error(message);
    error.code = "recent_auth_cancelled";
    return error;
  }

  function finishRecentAuthentication(error = null) {
    const pending = state.recentAuthPrompt;
    if (!pending) return;
    state.recentAuthPrompt = null;
    elements.recentAuthPassword.value = "";
    elements.recentAuthStatus.textContent = "";
    elements.recentAuthSubmit.disabled = false;
    if (elements.recentAuthDialog.open) elements.recentAuthDialog.close();
    if (error) pending.reject(error);
    else pending.resolve();
  }

  function requestRecentAuthentication() {
    if (state.recentAuthPrompt) return state.recentAuthPrompt.promise;
    if (!global.navigator.onLine) return Promise.reject(recentAuthCancellation("ANI is offline. No changes were made."));
    let resolvePrompt;
    let rejectPrompt;
    const promise = new Promise((resolve, reject) => {
      resolvePrompt = resolve;
      rejectPrompt = reject;
    });
    state.recentAuthPrompt = { promise, resolve: resolvePrompt, reject: rejectPrompt, account: accountId() };
    elements.recentAuthStatus.textContent = "";
    if (typeof elements.recentAuthDialog.showModal === "function") elements.recentAuthDialog.showModal();
    else elements.recentAuthDialog.setAttribute("open", "");
    global.setTimeout(() => elements.recentAuthPassword.focus(), 0);
    return promise;
  }

  async function confirmRecentAuthentication(event) {
    event.preventDefault();
    if (!state.recentAuthPrompt) return;
    const password = String(elements.recentAuthPassword.value || "");
    if (!password) {
      elements.recentAuthStatus.textContent = "Enter your current password.";
      return;
    }
    const payload = { password };
    elements.recentAuthSubmit.disabled = true;
    elements.recentAuthStatus.textContent = "Confirming with ANI's secure serverâ€¦";
    try {
      await request("/api/me/recent-auth", { method: "POST", body: payload });
      finishRecentAuthentication();
    } catch (error) {
      if (error?.status === 401) {
        finishRecentAuthentication(error);
        return;
      }
      elements.recentAuthStatus.textContent = safeError(error, "ANI could not confirm the password.");
    } finally {
      payload.password = "";
      elements.recentAuthPassword.value = "";
      if (state.recentAuthPrompt) elements.recentAuthSubmit.disabled = false;
    }
  }

  async function protectedRequest(pathname, options = {}) {
    try {
      return await request(pathname, options);
    } catch (error) {
      if (error?.code !== "recent_auth_required") throw error;
      await requestRecentAuthentication();
      return request(pathname, options);
    }
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 4 });
  }

  function formatNumber(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function formatDate(value) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "Unavailable" : parsed.toLocaleString();
  }

  function metric(label, value, detail = "") {
    const card = node("div", "lane2-metric");
    card.append(node("span", "", label), node("strong", "", value));
    if (detail) card.append(node("small", "", detail));
    return card;
  }

  function updateConnection() {
    const online = global.navigator.onLine;
    elements.connection.textContent = online ? "Online services reachable" : "Offline — local ANI available";
    elements.connection.classList.toggle("offline", !online);
    elements.generate.disabled = !online || state.loading;
    elements.syncNow.disabled = !online || !state.user;
  }

  function selectTab(tabName = "account") {
    document.querySelectorAll("[data-lane2-tab]").forEach((button) => {
      const selected = button.dataset.lane2Tab === tabName;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll("[data-lane2-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.lane2Panel !== tabName;
    });
    if (tabName === "membership") refreshMembership();
    if (tabName === "library") refreshLibrary();
    if (tabName === "admin" && state.user?.role === "admin") refreshAdmin();
  }

  function showPanel(tabName = "account") {
    elements.panel.hidden = false;
    document.body.classList.add("lane2-experience-open");
    selectTab(tabName);
    refreshAll();
    elements.close.focus();
  }

  function hidePanel() {
    if (state.recentAuthPrompt) finishRecentAuthentication(recentAuthCancellation());
    elements.panel.hidden = true;
    document.body.classList.remove("lane2-experience-open");
    elements.open.focus();
  }

  function setAccountAuthMode(mode = "login") {
    const forms = {
      login: byId("loginForm"),
      signup: byId("signupForm"),
      reset: byId("resetRequestForm")
    };
    Object.entries(forms).forEach(([key, form]) => {
      if (form) form.hidden = key !== mode;
    });
    const resetConfirm = byId("resetConfirmForm");
    if (resetConfirm) resetConfirm.hidden = mode !== "reset";
    const verificationPanel = byId("emailVerificationPanel");
    if (verificationPanel) verificationPanel.hidden = mode !== "verify";
    [
      ["showLoginButton", "login"],
      ["showSignupButton", "signup"],
      ["showVerifyButton", "verify"],
      ["showResetButton", "reset"]
    ].forEach(([buttonId, key]) => byId(buttonId)?.classList.toggle("active", key === mode));
    const status = byId("authStatus");
    if (status) {
      status.textContent = "";
      status.classList.remove("error");
    }
  }

  function bindAccountAuthModes() {
    [
      ["showLoginButton", "login"],
      ["showSignupButton", "signup"],
      ["showVerifyButton", "verify"],
      ["showResetButton", "reset"]
    ].forEach(([buttonId, mode]) => {
      byId(buttonId)?.addEventListener("click", () => setAccountAuthMode(mode));
    });
  }

  function expandAccountFormsForPortal(authPanel) {
    if (!authPanel) return;
    // Keep the canonical account-mode tabs active inside the larger portal.
    // The former expanded presentation force-unhid every form and hid the
    // tablist, which made the signed-out verification mode unreachable.
    authPanel.classList.remove("lane2-auth-expanded");
    setAccountAuthMode("login");
  }

  function renderAccount() {
    const signedIn = Boolean(state.user);
    elements.profilePanel.hidden = !signedIn;
    elements.adminTabButton.hidden = state.user?.role !== "admin";
    const legacyAdmin = byId("adminDashboardPanel");
    if (legacyAdmin) legacyAdmin.classList.add("lane2-legacy-admin-dashboard");
    if (!signedIn) {
      state.profile = null;
      state.sessions = [];
      state.sessionPolicy = null;
      elements.profileForm?.reset();
      renderSessions();
      return;
    }
    if (state.profile) {
      elements.profileName.value = state.profile.display_name || state.user.username || "";
      elements.profileTimezone.value = state.profile.timezone || "UTC";
      elements.profileLocale.value = state.profile.locale || "en-US";
      elements.profileVersion.textContent = `Version ${state.profile.version || 1}`;
    }
    renderSessions();
  }

  function formatDuration(seconds = 0) {
    const totalMinutes = Math.max(0, Math.round(Number(seconds || 0) / 60));
    if (totalMinutes >= 1440 && totalMinutes % 1440 === 0) return `${totalMinutes / 1440} days`;
    if (totalMinutes >= 60 && totalMinutes % 60 === 0) return `${totalMinutes / 60} hours`;
    return `${totalMinutes} minutes`;
  }

  function renderSessions() {
    if (!elements.sessionsList || !elements.sessionPolicy || !elements.revokeOtherSessions) return;
    const policy = state.sessionPolicy || {};
    elements.sessionPolicy.textContent = policy.idle_ttl_seconds
      ? `Sessions expire after ${formatDuration(policy.idle_ttl_seconds)} of inactivity, with an absolute limit of ${formatDuration(policy.absolute_ttl_seconds)}. Up to ${policy.max_sessions_per_user} devices may remain signed in.`
      : "Sessions expire automatically after inactivity.";
    elements.revokeOtherSessions.disabled = !state.user || state.sessions.filter((session) => !session.current).length === 0;
    elements.sessionsList.replaceChildren();
    if (!state.user || !state.sessions.length) {
      elements.sessionsList.append(node("p", "", state.user ? "No active sessions were found." : "Sign in to inspect active sessions."));
      return;
    }
    state.sessions.forEach((session) => {
      const row = node("article", "lane2-session-row");
      const detail = node("div");
      detail.append(node("strong", "", session.current ? `${session.device_label} (this device)` : session.device_label));
      detail.append(node("span", "", `Last active ${formatDate(session.last_seen_at)} · idle expiry ${formatDate(session.idle_expires_at)}`));
      row.append(detail);
      if (!session.current) {
        const button = node("button", "danger", "Sign out");
        button.type = "button";
        button.dataset.sessionId = session.id;
        button.setAttribute("aria-label", `Sign out ${session.device_label}`);
        row.append(button);
      } else {
        row.append(node("span", "lane2-current-session", "Current"));
      }
      elements.sessionsList.append(row);
    });
  }

  async function loadProfile() {
    if (!state.user) return null;
    const data = await request("/api/me/profile");
    state.profile = data.profile;
    renderAccount();
    return state.profile;
  }

  async function loadSessions() {
    if (!state.user) return [];
    const data = await request("/api/me/sessions");
    state.sessions = Array.isArray(data.sessions) ? data.sessions : [];
    state.sessionPolicy = data.policy || null;
    renderSessions();
    return state.sessions;
  }

  async function changePassword(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(elements.passwordForm).entries());
    if (values.new_password !== values.confirm_password) {
      setStatus("The new password confirmation does not match.", true);
      return;
    }
    setStatus("Changing password and signing out other devices…");
    try {
      const data = await request("/api/me/password", {
        method: "POST",
        body: { current_password: values.current_password, new_password: values.new_password }
      });
      state.sessions = Array.isArray(data.sessions) ? data.sessions : [];
      elements.passwordForm.reset();
      renderSessions();
      setStatus(data.message || "Password changed. Other devices were signed out.");
    } catch (error) {
      setStatus(safeError(error, "ANI could not change the password."), true);
    }
  }

  async function revokeOtherSessions() {
    if (!state.user) return;
    setStatus("Signing out other devices…");
    try {
      const data = await protectedRequest("/api/me/sessions/revoke-others", { method: "POST", body: {} });
      state.sessions = Array.isArray(data.sessions) ? data.sessions : [];
      renderSessions();
      setStatus(`${Number(data.revoked_count || 0)} other session${Number(data.revoked_count || 0) === 1 ? "" : "s"} signed out.`);
    } catch (error) {
      setStatus(safeError(error, "ANI could not sign out the other devices."), true);
    }
  }

  async function revokeSession(sessionId) {
    if (!sessionId || !state.user) return;
    setStatus("Signing out that device…");
    try {
      await protectedRequest(`/api/me/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE" });
      await loadSessions();
      setStatus("Device signed out.");
    } catch (error) {
      setStatus(safeError(error, "ANI could not sign out that device."), true);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (!state.user || !state.profile) return;
    setStatus("Saving profile…");
    try {
      const data = await request("/api/me/profile", {
        method: "PATCH",
        body: {
          display_name: elements.profileName.value,
          timezone: elements.profileTimezone.value,
          locale: elements.profileLocale.value,
          expected_version: state.profile.version
        }
      });
      state.profile = data.profile;
      await bridge.refreshAccount();
      renderAccount();
      queueSync("setting", "profile", { profile_version: state.profile.version, updated_at: state.profile.updated_at });
      setStatus("Profile saved.");
    } catch (error) {
      if (error.code === "profile_version_conflict") await loadProfile().catch(() => null);
      setStatus(safeError(error), true);
    }
  }

  async function deleteAccount(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(elements.deleteForm).entries());
    if (values.confirm !== "DELETE_MY_ANI_ACCOUNT") {
      setStatus("Type the exact account-deletion confirmation before continuing.", true);
      return;
    }
    if (!global.confirm("Permanently delete this ANI account? This cannot be undone from the app.")) return;
    setStatus("Deleting account…");
    try {
      await request("/api/me/profile", { method: "DELETE", body: values });
      state.user = null;
      state.profile = null;
      state.entitlements = null;
      state.lastGenerated = null;
      await bridge.refreshAccount();
      bindSync();
      renderAll();
      elements.deleteForm.reset();
      setStatus("Account deleted and this device signed out.");
    } catch (error) {
      setStatus(safeError(error), true);
    }
  }

  function renderMembership() {
    const signedIn = Boolean(state.user);
    const entitlement = state.entitlements || {};
    const usage = entitlement.usage || {};
    elements.membershipHeading.textContent = signedIn
      ? `${String(entitlement.subscription_plan || state.user.subscription_plan || "free").replace(/_/g, " ")} membership`
      : "Sign in to view entitlement";
    elements.entitlementGrid.replaceChildren(
      metric("Subscription", entitlement.subscription_status || state.user?.subscription_status || "signed out"),
      metric("AI allowance used", `${formatNumber(usage.monthly_ai_usage_percent || 0)}%`, `${formatNumber(usage.total_ai_requests_this_month || 0)} requests this month`),
      metric("Purchased credits", `${formatNumber(entitlement.credit_balance_units || 0)} credits`),
      metric("AI questions", entitlement.ai_question_generation?.enabled === false ? "Disabled" : "Available", usage.next_monthly_reset_date ? `Resets ${formatDate(usage.next_monthly_reset_date)}` : "Subject to entitlement and limits")
    );

    elements.plans.replaceChildren();
    state.plans.forEach((plan) => {
      const card = node("article", "lane2-plan-card");
      const current = signedIn && entitlement.subscription_plan === plan.plan_code;
      card.classList.toggle("current", current);
      card.append(node("span", "", current ? "Current plan" : plan.billing_interval === "none" ? "Free tier" : "Monthly membership"));
      card.append(node("strong", "", plan.display_name));
      card.append(node("b", "", plan.price_usd > 0 ? `${formatMoney(plan.price_usd)} / month` : "Free"));
      card.append(node("small", "", `${formatMoney(plan.included_ai_usd_internal)} internal monthly AI allowance`));
      const action = node("button", "", current ? "Current" : plan.plan_code === "free" ? "Included" : `Choose ${plan.display_name}`);
      action.type = "button";
      action.disabled = current || plan.plan_code === "free" || !signedIn || !state.payment.subscription_checkout_ready;
      action.addEventListener("click", () => createSubscriptionCheckout(plan.plan_code));
      card.append(action);
      elements.plans.append(card);
    });

    const checkouts = Array.isArray(entitlement.subscription_checkouts) ? entitlement.subscription_checkouts : [];
    const pending = state.pendingCheckout || checkouts.find((checkout) => checkout.status === "pending");
    elements.pendingCheckout.hidden = !pending;
    elements.pendingCheckout.replaceChildren();
    if (pending) {
      elements.pendingCheckout.append(node("strong", "", `${pending.plan_code.replace(/_/g, " ")} checkout pending`));
      elements.pendingCheckout.append(node("span", "", `${formatMoney(pending.amount_usd)} · expires ${formatDate(pending.expires_at)}`));
      if (state.payment.test_mode) {
        const complete = node("button", "", "Complete test checkout");
        complete.type = "button";
        complete.addEventListener("click", () => completeTestCheckout(pending.id));
        elements.pendingCheckout.append(complete);
      }
    }
    elements.cancelSubscription.hidden = !signedIn || !entitlement.subscription
      || Boolean(entitlement.subscription.cancel_at_period_end) || entitlement.subscription_status === "canceled";

    elements.paymentHistory.replaceChildren();
    const payments = Array.isArray(entitlement.payments) ? entitlement.payments : [];
    if (!payments.length) elements.paymentHistory.append(node("p", "lane2-empty", "No payment records."));
    payments.slice(0, 20).forEach((payment) => {
      const row = node("div", "lane2-record-row");
      const copy = node("div");
      copy.append(node("strong", "", String(payment.kind || "payment").replace(/_/g, " ")),
        node("span", "", `${payment.status} · ${formatDate(payment.created_at)}`));
      row.append(copy, node("b", "", formatMoney(payment.amount_usd)));
      elements.paymentHistory.append(row);
    });
  }

  async function refreshMembership() {
    try {
      const planData = await request("/api/billing/plans");
      state.plans = Array.isArray(planData.plans) ? planData.plans : [];
      state.payment = planData.payment || {};
      if (state.user) state.entitlements = await request("/api/me/entitlements");
      else state.entitlements = null;
      renderMembership();
    } catch (error) {
      renderMembership();
      setStatus(safeError(error, "Membership details are temporarily unavailable."), true);
    }
  }

  async function createSubscriptionCheckout(planCode) {
    setStatus("Creating a server-authorized test checkout…");
    try {
      const data = await request("/api/billing/subscription-checkout", {
        method: "POST",
        headers: { "Idempotency-Key": identifier("subscription-checkout") },
        body: { plan_code: planCode, return_url: location.href }
      });
      state.pendingCheckout = data.checkout;
      await refreshMembership();
      setStatus(data.replayed ? "Existing checkout restored." : "Test checkout created. No real charge was made.");
    } catch (error) {
      setStatus(safeError(error), true);
    }
  }

  async function completeTestCheckout(checkoutId) {
    setStatus("Completing checkout through the authoritative test provider…");
    try {
      await request(`/api/billing/test/subscription-checkouts/${encodeURIComponent(checkoutId)}/complete`, { method: "POST", body: {} });
      state.pendingCheckout = null;
      await bridge.refreshAccount();
      await refreshMembership();
      setStatus("Test membership activated. No real payment was processed.");
    } catch (error) {
      setStatus(safeError(error), true);
    }
  }

  async function cancelSubscription() {
    if (!global.confirm("Cancel this test subscription at the end of its current period?")) return;
    try {
      await protectedRequest("/api/me/subscription/cancel", {
        method: "POST",
        headers: { "Idempotency-Key": identifier("subscription-cancel") },
        body: {}
      });
      await refreshMembership();
      setStatus("Cancellation recorded for the end of the current test period.");
    } catch (error) {
      setStatus(safeError(error), true);
    }
  }

  function generationRoute(layout) {
    if (layout === "standard") return { pathname: "/api/ani/standard-question", key: "item" };
    if (layout === "bowtie") return { pathname: "/api/ani/cje", key: "caseItem" };
    if (layout === "unfolding") return { pathname: "/api/ani/unfolding", key: "caseItem" };
    return { pathname: "/api/ani/advanced-item", key: "item" };
  }

  async function generateQuestion(event) {
    event.preventDefault();
    if (!state.user) {
      selectTab("account");
      setStatus("Sign in before generating a paid AI question.", true);
      return;
    }
    if (!state.user.email_verified) {
      selectTab("account");
      setStatus("Verify your email before generating a paid AI question.", true);
      return;
    }
    if (!global.navigator.onLine) {
      setStatus(safeError({}), true);
      return;
    }
    const topic = elements.questionTopic.value.trim();
    const layout = elements.questionLayout.value;
    const difficulty = elements.questionDifficulty.value;
    const route = generationRoute(layout);
    const body = {
      message: `Generate one ${layout} NCLEX practice question on ${topic}.`,
      topic,
      layout,
      difficulty,
      reuseCached: elements.reuseCached.checked,
      context: { currentTopic: topic, currentDifficulty: difficulty, formatHint: layout }
    };
    const generationRequest = generationIdempotency.begin({
      account: accountId(),
      pathname: route.pathname,
      layout,
      body
    });
    const requestOptions = {
      method: "POST",
      headers: { "Idempotency-Key": generationRequest.key },
      body
    };
    state.loading = true;
    updateConnection();
    elements.generatedActions.hidden = true;
    setStatus(`Generating and validating a ${layout.replace(/_/g, " ")} question…`);
    try {
      const data = await protectedRequest(route.pathname, requestOptions);
      const item = data[route.key];
      bridge.renderGeneratedQuestion({ layout, item, prompt: topic });
      state.lastGenerated = {
        id: data.generatedQuestionId,
        requestId: data.generationRequestId,
        layout,
        topic,
        item,
        cacheHit: Boolean(data.cacheHit)
      };
      generationIdempotency.succeed(generationRequest);
      elements.generatedSummary.textContent = `${layout.replace(/_/g, " ")} rendered in chat · ${data.cacheHit ? "approved cache reused" : "new mock output validated"}`;
      elements.generatedActions.hidden = false;
      await refreshMembership();
      setStatus(`Question validated and rendered${data.cacheHit ? " from ANI's approved cache" : ""}.`);
    } catch (error) {
      generationIdempotency.fail(generationRequest, error);
      state.lastGenerated = null;
      setStatus(`${safeError(error)}${error.requestId ? ` Reference: ${error.requestId}` : ""}`, true);
      reportClientError(error, "question_generation");
    } finally {
      state.loading = false;
      updateConnection();
    }
  }

  async function saveGeneratedQuestion() {
    if (!state.lastGenerated?.id) return;
    try {
      const data = await request("/api/me/saved-questions", {
        method: "POST",
        body: { generated_question_id: state.lastGenerated.id, notes: "Saved from ANI AI Practice" }
      });
      queueSync("saved_question", data.saved_question.id, {
        generated_question_id: state.lastGenerated.id,
        layout: state.lastGenerated.layout,
        topic: state.lastGenerated.topic,
        saved: true
      });
      await syncNow({ quiet: true });
      await refreshLibrary();
      setStatus("Question saved to your ANI library.");
    } catch (error) {
      setStatus(safeError(error), true);
    }
  }

  function bindSync() {
    state.sync = syncFactory.create({ accountId: accountId() });
    renderSync();
  }

  function queueSync(entityType, clientRecordId, payload, options = {}) {
    if (!state.user || !state.sync) return null;
    try {
      const record = state.sync.queueChange(entityType, clientRecordId, payload, options);
      renderSync();
      return record;
    } catch (error) {
      setStatus(safeError(error, "Local change is still available, but the sync queue could not accept it."), true);
      return null;
    }
  }

  function mirrorKey() {
    return `ani-lane2-remote-records-v1:${accountId()}`;
  }

  function readMirror() {
    try {
      const parsed = JSON.parse(localStorage.getItem(mirrorKey()) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function storeRemoteRecords(records = []) {
    const map = new Map(readMirror().map((record) => [`${record.entity_type}:${record.client_record_id}`, record]));
    records.forEach((record) => map.set(`${record.entity_type}:${record.client_record_id}`, record));
    const next = [...map.values()].sort((a, b) => String(b.server_updated_at).localeCompare(String(a.server_updated_at))).slice(0, 1000);
    localStorage.setItem(mirrorKey(), JSON.stringify(next));
    state.remoteRecords = next;
  }

  async function syncNow({ quiet = false } = {}) {
    if (!state.user || !state.sync) return;
    if (!global.navigator.onLine) {
      renderSync();
      if (!quiet) setStatus("Offline changes remain queued safely on this device.");
      return;
    }
    try {
      const pushed = await state.sync.flush();
      const pulled = await state.sync.pull();
      storeRemoteRecords(pulled.records || []);
      renderSync();
      renderStudyHistory();
      if (!quiet) setStatus(`Sync complete: ${pushed.applied?.length || 0} uploaded, ${pulled.records?.length || 0} downloaded.`);
    } catch (error) {
      renderSync();
      if (!quiet) setStatus(safeError(error, "Sync paused. Local data remains unchanged."), true);
    }
  }

  function renderSync() {
    const snapshot = state.sync?.snapshot?.() || { queue: [], conflicts: [], lastSyncAt: null };
    elements.syncSummary.replaceChildren(
      metric("Connection", global.navigator.onLine ? "Online" : "Offline"),
      metric("Pending uploads", snapshot.queue.length),
      metric("Conflicts", snapshot.conflicts.length),
      metric("Last sync", snapshot.lastSyncAt ? formatDate(snapshot.lastSyncAt) : "Not yet")
    );
    elements.conflicts.replaceChildren();
    snapshot.conflicts.forEach((conflict) => {
      const row = node("div", "lane2-conflict-row");
      row.append(node("strong", "", `${conflict.requested?.entity_type}: ${conflict.requested?.client_record_id}`),
        node("span", "", `Server version ${conflict.current?.version || 0}; local expected ${conflict.requested?.expected_version || 0}`));
      const actions = node("div", "lane2-inline-actions");
      const keep = node("button", "", "Keep local");
      const accept = node("button", "", "Accept server");
      keep.type = accept.type = "button";
      keep.addEventListener("click", async () => {
        state.sync.resolveConflict(conflict.requested.entity_type, conflict.requested.client_record_id, "keep_local");
        await syncNow();
      });
      accept.addEventListener("click", () => {
        const resolution = state.sync.resolveConflict(conflict.requested.entity_type, conflict.requested.client_record_id, "accept_server");
        if (resolution?.conflict?.current) {
          storeRemoteRecords([resolution.conflict.current]);
          bridge.applyAcceptedSyncRecord(resolution.conflict.current);
        }
        renderSync();
        renderStudyHistory();
        setStatus("Server version accepted after explicit review.");
      });
      actions.append(keep, accept);
      row.append(actions);
      elements.conflicts.append(row);
    });
  }

  function renderSavedQuestions() {
    elements.savedQuestions.replaceChildren();
    if (!state.user) {
      elements.savedQuestions.append(node("p", "lane2-empty", "Sign in to load saved questions."));
      return;
    }
    if (!state.savedQuestions.length) {
      elements.savedQuestions.append(node("p", "lane2-empty", "No generated questions saved yet."));
      return;
    }
    state.savedQuestions.forEach((saved) => {
      const available = saved.validation_status === "passed" && saved.review_status !== "rejected";
      const row = node("div", "lane2-record-row");
      const copy = node("div");
      copy.append(node("strong", "", `${saved.topic} · ${saved.layout}`),
        node("span", "", available ? formatDate(saved.updated_at) : "Unavailable after safety review"));
      const open = node("button", "", available ? "Open" : "Unavailable");
      open.type = "button";
      open.disabled = !available;
      if (available) open.addEventListener("click", () => {
        try {
          bridge.renderGeneratedQuestion({ layout: saved.layout, item: saved.content, prompt: saved.topic });
          hidePanel();
        } catch (error) {
          setStatus(safeError(error, "Saved question could not be rendered."), true);
        }
      });
      row.append(copy, open);
      elements.savedQuestions.append(row);
    });
  }

  function renderStudyHistory() {
    elements.studyHistory.replaceChildren();
    const remote = state.remoteRecords.filter((record) => record.entity_type === "quiz_result" || record.entity_type === "study_progress");
    const queued = (state.sync?.snapshot?.().queue || [])
      .filter((record) => record.entity_type === "quiz_result" || record.entity_type === "study_progress")
      .map((record) => ({ ...record, server_updated_at: record.client_updated_at, pending: true }));
    const records = [...queued, ...remote]
      .sort((a, b) => String(b.client_updated_at || b.server_updated_at).localeCompare(String(a.client_updated_at || a.server_updated_at)));
    if (!records.length) {
      elements.studyHistory.append(node("p", "lane2-empty", "Complete a question to add study history. Offline results will queue locally."));
      return;
    }
    records.slice(0, 50).forEach((record) => {
      const row = node("div", "lane2-record-row");
      const payload = record.payload || {};
      const title = payload.topic || payload.title || record.client_record_id;
      row.append(node("strong", "", title), node("span", "", `${payload.score_text || payload.status || record.entity_type}${record.pending ? " · pending sync" : ""} · ${formatDate(record.client_updated_at)}`));
      elements.studyHistory.append(row);
    });
  }

  async function refreshLibrary() {
    state.remoteRecords = readMirror();
    if (state.user) {
      try {
        const data = await request("/api/me/saved-questions?limit=100");
        state.savedQuestions = Array.isArray(data.saved_questions) ? data.saved_questions : [];
      } catch (error) {
        setStatus(safeError(error, "Saved questions could not be refreshed."), true);
      }
    } else state.savedQuestions = [];
    renderSavedQuestions();
    renderStudyHistory();
    renderSync();
  }

  function controlRow(control, label) {
    const row = node("div", "lane2-control-row");
    const copy = node("div");
    copy.append(node("strong", "", label), node("span", "", `Daily requests: ${control.integer_limit ?? "deployment default"} · Daily cost: ${control.decimal_limit ?? "deployment default"}`));
    const toggle = node("button", control.enabled ? "" : "danger", control.enabled ? "Disable" : "Enable");
    toggle.type = "button";
    toggle.addEventListener("click", async () => {
      const reason = global.prompt(`Reason to ${control.enabled ? "disable" : "enable"} ${label}:`, "Administrative safety control") || "";
      if (reason.trim().length < 4) return;
      try {
        await protectedRequest(`/api/admin/features/${encodeURIComponent(control.feature_key)}`, {
          method: "PATCH",
          body: { enabled: !control.enabled, integer_limit: control.integer_limit, decimal_limit: control.decimal_limit, config: control.config || {}, reason }
        });
        await refreshAdmin();
      } catch (error) {
        setStatus(safeError(error), true);
      }
    });
    row.append(copy, toggle);
    return row;
  }

  function renderAdminUsers() {
    elements.adminUsers.replaceChildren();
    state.adminUsers.forEach((user) => {
      const row = node("article", "lane2-admin-user");
      const heading = node("div");
      heading.append(node("strong", "", user.username || user.email),
        node("span", "", `${user.email} · ${user.subscription_plan}/${user.subscription_status} · ${formatNumber(user.extra_ai_credit_balance_units)} credits`));
      const actions = node("div", "lane2-inline-actions");
      const status = node("button", user.account_status === "active" ? "danger" : "", user.account_status === "active" ? "Disable account" : "Enable account");
      const ai = node("button", user.ai_question_generation_enabled ? "danger" : "", user.ai_question_generation_enabled ? "Disable AI" : "Enable AI");
      const credits = node("button", "", "Adjust credits");
      [status, ai, credits].forEach((button) => { button.type = "button"; });
      status.addEventListener("click", () => updateAdminUserStatus(user));
      ai.addEventListener("click", () => updateAdminUserAi(user));
      credits.addEventListener("click", () => adjustAdminCredits(user));
      actions.append(status, ai, credits);
      row.append(heading, actions);
      elements.adminUsers.append(row);
    });
    if (!state.adminUsers.length) elements.adminUsers.append(node("p", "lane2-empty", "No matching users."));
  }

  async function updateAdminUserStatus(user) {
    const next = user.account_status === "active" ? "disabled" : "active";
    const reason = global.prompt(`Reason to set account ${next}:`, "Administrative account review") || "";
    if (reason.trim().length < 4) return;
    try {
      await protectedRequest(`/api/admin/users/${encodeURIComponent(user.id)}/status`, { method: "PATCH", body: { status: next, reason } });
      await refreshAdminUsers();
      setStatus(`Account set to ${next}.`);
    } catch (error) { setStatus(safeError(error), true); }
  }

  async function updateAdminUserAi(user) {
    const reason = global.prompt(`Reason to ${user.ai_question_generation_enabled ? "disable" : "enable"} AI for this user:`, "Administrative AI safety review") || "";
    if (reason.trim().length < 4) return;
    try {
      await protectedRequest(`/api/admin/users/${encodeURIComponent(user.id)}/ai-control`, {
        method: "PATCH",
        body: { enabled: !user.ai_question_generation_enabled, reason }
      });
      await refreshAdminUsers();
      setStatus("Per-user AI control updated and audited.");
    } catch (error) { setStatus(safeError(error), true); }
  }

  async function adjustAdminCredits(user) {
    const amount = Number(global.prompt("Credit adjustment (positive or negative):", "100"));
    if (!Number.isFinite(amount) || amount === 0) return;
    const reason = global.prompt("Reason for credit adjustment:", "Reviewed manual test adjustment") || "";
    if (reason.trim().length < 4) return;
    try {
      await protectedRequest(`/api/admin/users/${encodeURIComponent(user.id)}/credits`, {
        method: "POST",
        headers: { "Idempotency-Key": identifier("admin-credit") },
        body: { units_delta: amount, reason }
      });
      await refreshAdminUsers();
      setStatus("Credit adjustment recorded in the audit ledger.");
    } catch (error) { setStatus(safeError(error), true); }
  }

  function renderAdminEvidence(target, rows, describe) {
    target.replaceChildren();
    if (!rows.length) target.append(node("p", "lane2-empty", "No records."));
    rows.slice(0, 50).forEach((row) => {
      const description = describe(row);
      const item = node("div", "lane2-record-row");
      const copy = node("div");
      copy.append(node("strong", "", description.title), node("span", "", description.detail));
      item.append(copy);
      if (description.action) item.append(description.action);
      target.append(item);
    });
  }

  function renderAdmin() {
    const snapshot = state.adminSnapshot || {};
    const dashboard = snapshot.test_dashboard || {};
    const usage = snapshot.ai_usage || {};
    elements.adminMetrics.replaceChildren(
      metric("Provider mode", `${snapshot.test_environment?.ai_provider || "unknown"} / ${snapshot.test_environment?.payment_provider || "unknown"}`),
      metric("AI cost this month", formatMoney(usage.total_ai_cost_this_month || snapshot.live_usage_totals?.estimated_cost_usd || 0)),
      metric("Accounting holds", usage.accounting_error_reservation_count || 0,
        `${formatMoney(usage.accounting_error_estimated_cost_this_month || 0)} estimated liability`),
      metric("Mock calls", dashboard.mock_ai_calls || 0, `${dashboard.simulated_input_tokens || 0} input / ${dashboard.simulated_output_tokens || 0} output tokens`),
      metric("Cache hits", dashboard.cache_hits || 0),
      metric("Unsafe cache hits rejected", snapshot.cache?.stats?.invalidCacheHitsRejected || 0),
      metric("Duplicates prevented", dashboard.duplicate_calls_prevented || 0),
      metric("Validation failures", dashboard.validation_failures || 0),
      metric("Payment test events", dashboard.payment_test_events || 0),
      metric("Rate-limit events", dashboard.rate_limit_events || 0)
    );
    elements.generatorMode.textContent = snapshot.test_environment?.ai_provider === "mock"
      ? "Mock mode · $0 actual"
      : snapshot.test_environment?.live_ai_accounting_blocked
        ? "Live provider paused · accounting reconciliation required"
        : "Live provider mode";
    elements.adminControls.replaceChildren();
    (snapshot.feature_controls || []).filter((control) => ["ai.global", "ai.question_generation"].includes(control.feature_key))
      .forEach((control) => elements.adminControls.append(controlRow(control,
        control.feature_key === "ai.global" ? "Global AI kill switch" : "Question-generation kill switch")));
    renderAdminUsers();
    renderAdminEvidence(elements.adminFailures, snapshot.generation_failures || [], (row) => ({
      title: `${row.layout || "question"} · ${row.status}`,
      detail: `${row.error_code || "failure"} · ${row.topic || "unknown topic"} · ${formatDate(row.created_at)}`
    }));
    renderAdminEvidence(elements.adminPayments, snapshot.payment_events || [], (row) => ({
      title: `${row.provider} · ${row.event_type}`,
      detail: `${row.status}/${row.disposition || "processed"} · ${formatDate(row.created_at)}`
    }));
    renderAdminEvidence(elements.adminErrors, snapshot.errors || [], (row) => ({
      title: `${row.component} · ${row.error_code}`,
      detail: `${row.safe_message} · ${formatDate(row.created_at)}`
    }));
    renderAdminEvidence(elements.adminReview, snapshot.review_queue || [], (row) => {
      const review = node("button", "", "Review");
      review.type = "button";
      review.addEventListener("click", async () => {
        const decision = global.prompt("Decision: approved or rejected", row.validation_status === "passed" ? "approved" : "rejected") || "";
        const reason = global.prompt("Review reason:", "Reviewed in ANI administration") || "";
        if (!new Set(["approved", "rejected"]).has(decision) || reason.trim().length < 4) return;
        try {
          await protectedRequest(`/api/admin/questions/${encodeURIComponent(row.id)}/review`, { method: "PATCH", body: { decision, reason } });
          await refreshAdmin();
        } catch (error) { setStatus(safeError(error), true); }
      });
      return { title: `${row.layout} · ${row.review_status}`, detail: `${row.topic} · validation ${row.validation_status}`, action: review };
    });
  }

  async function refreshAdminUsers() {
    if (state.user?.role !== "admin") return;
    const query = elements.adminUserQuery.value.trim();
    const data = await request(`/api/admin/users?q=${encodeURIComponent(query)}&limit=100`);
    state.adminUsers = Array.isArray(data.users) ? data.users : [];
    renderAdminUsers();
  }

  async function refreshAdmin() {
    if (state.user?.role !== "admin") return;
    try {
      const [snapshot] = await Promise.all([request("/api/admin/lane2?limit=100"), refreshAdminUsers()]);
      state.adminSnapshot = snapshot;
      renderAdmin();
    } catch (error) {
      setStatus(safeError(error, "Administrative data could not be loaded."), true);
    }
  }

  async function refreshAll() {
    if (state.loading) return;
    try {
      await Promise.all([
        refreshMembership(),
        state.user ? Promise.all([loadProfile(), loadSessions()]) : Promise.resolve(),
        refreshLibrary()
      ]);
      renderAll();
    } catch (error) {
      setStatus(safeError(error), true);
    }
  }

  function renderAll() {
    renderAccount();
    renderMembership();
    renderSavedQuestions();
    renderStudyHistory();
    renderSync();
    updateConnection();
  }

  function reportClientError(error, component = "experience") {
    const body = {
      component,
      code: String(error?.code || "client_error").slice(0, 80),
      message: safeError(error).slice(0, 300),
      request_id: String(error?.requestId || "").slice(0, 160),
      online: global.navigator.onLine,
      page: location.pathname
    };
    request("/api/client-errors", { method: "POST", body }).catch(() => null);
  }

  document.querySelectorAll("[data-lane2-tab]").forEach((button) => {
    button.addEventListener("click", () => selectTab(button.dataset.lane2Tab));
  });
  elements.open.addEventListener("click", () => showPanel("account"));
  elements.close.addEventListener("click", hidePanel);
  elements.panel.dataset.clientVersion = "2026-07-30.2";
  elements.panel.addEventListener("click", (event) => {
    if (event.target === elements.panel) {
      hidePanel();
      return;
    }
    const authModeButton = event.target.closest?.("#showLoginButton, #showSignupButton, #showVerifyButton, #showResetButton");
    if (authModeButton) {
      const mode = authModeButton.id === "showSignupButton"
        ? "signup"
        : authModeButton.id === "showVerifyButton"
          ? "verify"
          : authModeButton.id === "showResetButton" ? "reset" : "login";
      setAccountAuthMode(mode);
    }
  });
  elements.profileForm.addEventListener("submit", saveProfile);
  elements.recentAuthForm.addEventListener("submit", confirmRecentAuthentication);
  elements.recentAuthCancel.addEventListener("click", () => finishRecentAuthentication(recentAuthCancellation()));
  elements.recentAuthDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    finishRecentAuthentication(recentAuthCancellation());
  });
  elements.passwordForm.addEventListener("submit", changePassword);
  elements.sessionsRefresh.addEventListener("click", () => loadSessions().catch((error) => setStatus(safeError(error), true)));
  elements.revokeOtherSessions.addEventListener("click", revokeOtherSessions);
  elements.sessionsList.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-session-id]");
    if (button) revokeSession(button.dataset.sessionId);
  });
  elements.deleteForm.addEventListener("submit", deleteAccount);
  elements.membershipRefresh.addEventListener("click", refreshMembership);
  elements.cancelSubscription.addEventListener("click", cancelSubscription);
  elements.questionForm.addEventListener("submit", generateQuestion);
  elements.questionForm.addEventListener("reset", () => generationIdempotency.reset());
  elements.saveQuestion.addEventListener("click", saveGeneratedQuestion);
  elements.syncNow.addEventListener("click", () => syncNow());
  elements.adminRefresh.addEventListener("click", refreshAdmin);
  elements.adminSearchForm.addEventListener("submit", (event) => { event.preventDefault(); refreshAdminUsers(); });
  [
    ["voiceStyleSelect", "ani-voice-style"],
    ["dynamicVoiceToggle", "ani-dynamic-voice"],
    ["speechRateRange", "ani-speech-rate"],
    ["keepMicReadyToggle", "ani-keep-mic-ready-v1"]
  ].forEach(([elementId, storageKey]) => {
    byId(elementId)?.addEventListener("change", (event) => {
      const value = event.target.type === "checkbox" ? String(event.target.checked) : event.target.value;
      queueSync("setting", storageKey, { storage_key: storageKey, value }, { updatedAt: new Date().toISOString() });
      if (global.navigator.onLine) syncNow({ quiet: true });
    });
  });

  global.addEventListener("online", () => {
    updateConnection();
    syncNow({ quiet: true });
    setStatus("Connection restored. Pending study changes are syncing.");
  });
  global.addEventListener("offline", () => {
    if (state.recentAuthPrompt) finishRecentAuthentication(recentAuthCancellation("ANI went offline. No changes were made."));
    updateConnection();
    setStatus("ANI is offline. Encyclopedia search, cards, favorites, and local study remain available.");
  });
  global.addEventListener("ani:auth-change", (event) => {
    if (state.recentAuthPrompt) finishRecentAuthentication(recentAuthCancellation("The signed-in account changed. No changes were made."));
    state.user = event.detail?.user || null;
    state.profile = null;
    state.sessions = [];
    state.sessionPolicy = null;
    state.entitlements = null;
    state.pendingCheckout = null;
    state.lastGenerated = null;
    generationIdempotency.reset();
    bindSync();
    renderAll();
    if (state.user) refreshAll();
  });
  global.addEventListener("ani:favorite-change", (event) => {
    const detail = event.detail || {};
    queueSync("favorite", detail.key, {
      favorite: Boolean(detail.favorite), type: detail.type, name: detail.name
    }, { deleted: !detail.favorite, updatedAt: detail.updatedAt });
    if (global.navigator.onLine) syncNow({ quiet: true });
  });
  global.addEventListener("ani:question-graded", (event) => {
    const detail = event.detail || {};
    const item = detail.item || {};
    const quizId = identifier(`quiz-${String(item.id || detail.kind || "item").replace(/[^a-z0-9-]/gi, "-")}`);
    const payload = {
      kind: detail.kind,
      topic: item.topic || "Unknown topic",
      title: item.title || item.stem || "ANI practice question",
      score_text: detail.result?.scoreText || "",
      score: Number(detail.result?.score || 0),
      max_score: Number(detail.result?.maxScore || 1),
      status: "graded"
    };
    queueSync("quiz_result", quizId, payload, { updatedAt: detail.updatedAt });
    const progressKey = String(item.topic || "unknown-topic").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 120);
    queueSync("study_progress", progressKey, { ...payload, last_attempt_at: detail.updatedAt }, { updatedAt: detail.updatedAt });
    state.remoteRecords = readMirror();
    renderStudyHistory();
    if (global.navigator.onLine) syncNow({ quiet: true });
  });
  global.addEventListener("error", (event) => {
    if (String(event.filename || "").includes("lane2-experience")) reportClientError(event.error || new Error(event.message), "experience_runtime");
  });
  global.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason instanceof Error ? event.reason : new Error("Unhandled client operation failed.");
    reportClientError(reason, "experience_promise");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.recentAuthDialog.open) {
      event.preventDefault();
      finishRecentAuthentication(recentAuthCancellation());
    } else if (event.key === "Escape" && !elements.panel.hidden) {
      event.preventDefault();
      hidePanel();
    }
  });

  // Escape the instructor-stage stacking context so this fixed, modal-style
  // portal receives pointer and keyboard input above the tutor workspace.
  if (elements.panel.parentElement !== document.body) document.body.append(elements.panel);
  const authPanel = byId("authPanel");
  if (authPanel && elements.accountMount) elements.accountMount.append(authPanel);
  bindAccountAuthModes();
  expandAccountFormsForPortal(authPanel);
  bindSync();
  state.remoteRecords = readMirror();
  renderAll();
  refreshMembership();
  global.AniLane2Experience = Object.freeze({ open: showPanel, syncNow, snapshot: () => ({
    user: state.user ? { ...state.user } : null,
    entitlements: state.entitlements ? { ...state.entitlements } : null,
    sync: state.sync?.snapshot?.() || null,
    lastGenerated: state.lastGenerated ? { ...state.lastGenerated, item: undefined } : null
  }) });
})(window);
