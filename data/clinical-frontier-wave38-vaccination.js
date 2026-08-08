/* eslint-disable */
/* Wave 38: current CDC-based U.S. lifespan vaccination schedule and vaccine-type cards. */
(function () {
  "use strict";

  const VERSION = "2026-07-21-wave38-vaccination-1";
  const GLOBAL_NAME = "ANI_CLINICAL_FRONTIER_WAVE38_VACCINATION";
  const SCHEDULE_NAME = "U.S. Lifespan Vaccination Schedule";
  if (window[GLOBAL_NAME] && window[GLOBAL_NAME].version === VERSION) return;

  const database = window.ANI_FOUNDATIONS_DATABASE;
  if (!database || !Array.isArray(database.entries)) {
    window[GLOBAL_NAME] = Object.freeze({
      schemaVersion: 1,
      version: VERSION,
      applied: false,
      reason: "ANI_FOUNDATIONS_DATABASE was unavailable."
    });
    return;
  }
  if (!Array.isArray(database.sourceReferences)) database.sourceReferences = [];

  const clean = (value) => String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  const normalize = (value) => clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const unique = (values) => {
    const seen = new Set();
    return (Array.isArray(values) ? values : [])
      .map(clean)
      .filter((value) => {
        const key = normalize(value);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };
  const list = (values) => unique(values).join("; ");

  const sourceReferences = Object.freeze([
    {
      key: "w38-cdc-child-age-current",
      label: "CDC: Current Child and Adolescent Immunization Schedule by Age",
      url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age-compliant.html",
      note: "Current CDC age table for people age 18 years or younger. The page states that the July 2, 2025 schedule remains current under the March 16, 2026 court stay."
    },
    {
      key: "w38-cdc-child-notes-current",
      label: "CDC: Child and Adolescent Immunization Schedule Notes",
      url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html",
      note: "Routine, catch-up, risk-based, product-specific, pregnancy, and immunocompromise notes for the current child schedule."
    },
    {
      key: "w38-cdc-child-catchup-current",
      label: "CDC: Catch-up Immunization Schedule for Children and Adolescents",
      url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html",
      note: "Minimum ages and minimum intervals; explicitly states that a delayed vaccine series is not restarted."
    },
    {
      key: "w38-cdc-adult-age-current",
      label: "CDC: Current Adult Immunization Schedule by Age",
      url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-age-compliant.html",
      note: "Current CDC adult table: July 2, 2025 baseline, amended April 27, 2026 for the adult RSV recommendation."
    },
    {
      key: "w38-cdc-adult-notes-current",
      label: "CDC: Adult Immunization Schedule Notes",
      url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html",
      note: "Adult dosing frequencies, intervals, medical indications, shared decision-making, and special situations."
    },
    {
      key: "w38-cdc-adult-appendix-current",
      label: "CDC: Adult Immunization Schedule Appendix",
      url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-appendix.html",
      note: "Contraindications and precautions for vaccines on the adult schedule."
    },
    {
      key: "w38-cdc-best-practices",
      label: "CDC: General Best Practices for Immunization",
      url: "https://www.cdc.gov/vaccines/hcp/imz-best-practices/index.html",
      note: "Administration, spacing, contraindication screening, altered immunocompetence, pregnancy, documentation, storage, and adverse-reaction principles."
    },
    {
      key: "w38-cdc-contraindications",
      label: "CDC: Contraindications and Precautions",
      url: "https://www.cdc.gov/vaccines/hcp/imz-best-practices/contraindications-precautions.html",
      note: "Current general and vaccine-specific contraindication and precaution framework."
    },
    {
      key: "w38-cdc-administration",
      label: "CDC: Vaccine Administration",
      url: "https://www.cdc.gov/vaccines/hcp/imz-best-practices/vaccine-administration.html",
      note: "Route, site, technique, preparation, and the safety consequences of nonstandard administration."
    },
    {
      key: "w38-cdc-vaccine-names",
      label: "CDC: U.S. Vaccine Names",
      url: "https://www.cdc.gov/vaccines/hcp/vaccines-us/",
      note: "CDC product, brand, abbreviation, route, and approved-age table updated July 8, 2026."
    },
    {
      key: "w38-cdc-covid-current",
      label: "CDC: 2025-2026 COVID-19 Vaccination Guidance",
      url: "https://www.cdc.gov/covid/hcp/vaccine-considerations/routine-guidance.html",
      note: "Current season-specific COVID-19 schedule by age, history, formulation, and immune status."
    },
    {
      key: "w38-cdc-rsv-infant-current",
      label: "CDC: RSV Immunization Guidance for Infants and Young Children",
      url: "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/infants-young-children.html",
      note: "Current nirsevimab and clesrovimab eligibility, timing, dosing, second-season limits, and maternal-vaccine coordination."
    },
    {
      key: "w38-cdc-rsv-pregnancy-current",
      label: "CDC: RSV Vaccine Guidance for Pregnant Women",
      url: "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/pregnant-people.html",
      note: "Current maternal Abrysvo timing and coordination with infant RSV antibody."
    },
    {
      key: "w38-cdc-rsv-adult-current",
      label: "CDC: RSV Vaccine Guidance for Adults",
      url: "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/adults.html",
      note: "Current single-dose recommendation for all adults age 75 or older and adults age 50-74 at increased risk."
    },
    {
      key: "w38-cdc-pneumococcal-current",
      label: "CDC: Pneumococcal Vaccine Recommendations",
      url: "https://www.cdc.gov/pneumococcal/hcp/vaccine-recommendations/index.html",
      note: "Current age-, risk-, product-, and history-dependent PCV and PPSV23 recommendations."
    },
    {
      key: "w38-cdc-influenza-current",
      label: "CDC: Influenza Vaccine Dosage and Administration",
      url: "https://www.cdc.gov/flu/hcp/vax-summary/vaccine-dosage-admin.html",
      note: "Current product-, age-, route-, and formulation-dependent influenza administration guidance."
    },
    {
      key: "w38-cdc-adenovirus-vaccine",
      label: "CDC: Adenovirus Vaccine Information",
      url: "https://www.cdc.gov/adenovirus/vaccines/index.html",
      note: "Military-population indication, live oral product, and safety information."
    },
    {
      key: "w38-cdc-anthrax-vaccine",
      label: "CDC: Anthrax Vaccination",
      url: "https://www.cdc.gov/anthrax/hcp/vaccines/index.html",
      note: "Preexposure and postexposure anthrax vaccine schedules and risk groups."
    },
    {
      key: "w38-cdc-chikungunya-vaccine",
      label: "CDC: Chikungunya Vaccine Information for Healthcare Providers",
      url: "https://www.cdc.gov/chikungunya/hcp/vaccine/index.html",
      note: "Current VIMKUNYA-only U.S. guidance: age 12 years or older, travel/outbreak and laboratory indications, precautions, and single-dose administration."
    },
    {
      key: "w38-fda-ixchiq-suspended",
      label: "FDA: Ixchiq Biologics License Suspension Safety Communication",
      url: "https://www.fda.gov/safety/medical-product-safety-information/fda-update-safety-ixchiq-chikungunya-vaccine-live-fda-suspends-biologics-license-fda-safety",
      note: "FDA suspended the Ixchiq biologics license on August 22, 2025 because of serious safety concerns; it is not presented as an available current U.S. option."
    },
    {
      key: "w38-cdc-dengue-vaccine",
      label: "CDC: Dengue Vaccine Guidance",
      url: "https://www.cdc.gov/dengue/hcp/vaccine/index.html",
      note: "Current restricted Dengvaxia indication plus the manufacturer-discontinuation notice and current U.S. access information."
    },
    {
      key: "w38-cdc-cholera-vaccine",
      label: "CDC Yellow Book: Cholera",
      url: "https://www.cdc.gov/yellow-book/hcp/travel-associated-infections-diseases/cholera.html",
      note: "Travel indication and live oral cholera-vaccine timing."
    },
    {
      key: "w38-cdc-ebola-vaccine",
      label: "CDC: Ebola Vaccines",
      url: "https://www.cdc.gov/ebola/hcp/vaccines/index.html",
      note: "Current occupational/outbreak Ebola-vaccine guidance."
    },
    {
      key: "w38-cdc-je-vaccine",
      label: "CDC: Japanese Encephalitis Vaccine",
      url: "https://www.cdc.gov/japanese-encephalitis/hcp/vaccine/index.html",
      note: "Travel-risk indications, primary series, and booster timing."
    },
    {
      key: "w38-cdc-rabies-prep",
      label: "CDC: Rabies Pre-exposure Prophylaxis",
      url: "https://www.cdc.gov/rabies/hcp/clinical-care/pre-exposure-prophylaxis.html",
      note: "Risk categories, two-dose PrEP series, titers, and boosters."
    },
    {
      key: "w38-cdc-rabies-pep",
      label: "CDC: Rabies Post-exposure Prophylaxis",
      url: "https://www.cdc.gov/rabies/hcp/clinical-care/post-exposure-prophylaxis.html",
      note: "Wound care, immune globulin, and vaccine schedules after exposure."
    },
    {
      key: "w38-cdc-typhoid-vaccine",
      label: "CDC: Typhoid Vaccination",
      url: "https://www.cdc.gov/typhoid-fever/vaccines/index.html",
      note: "Injectable and live oral typhoid product schedules and travel use."
    },
    {
      key: "w38-cdc-smallpox-vaccine",
      label: "CDC: Smallpox Vaccines",
      url: "https://www.cdc.gov/smallpox/vaccines/index.html",
      note: "Replicating vaccinia vaccine, occupational use, administration, and contact precautions."
    },
    {
      key: "w38-cdc-yellow-fever-vaccine",
      label: "CDC: Yellow Fever Vaccine",
      url: "https://www.cdc.gov/yellow-fever/vaccine/index.html",
      note: "Travel requirements, live-vaccine eligibility, certificate timing, and booster exceptions."
    }
  ]);

  const sourceEffectiveDates = Object.freeze({
    "w38-cdc-child-age-current": "2025-07-02 (confirmed current by CDC under the 2026-03-16 stay)",
    "w38-cdc-child-notes-current": "2025-07-02 (confirmed current by CDC under the 2026-03-16 stay)",
    "w38-cdc-child-catchup-current": "2025-07-02 (confirmed current by CDC under the 2026-03-16 stay)",
    "w38-cdc-adult-age-current": "2025-07-02; amended 2026-04-27 for adult RSV",
    "w38-cdc-adult-notes-current": "2025-07-02; amended 2026-04-27 for adult RSV",
    "w38-cdc-adult-appendix-current": "2025-07-02",
    "w38-cdc-best-practices": "2024-07-25; current page reviewed 2026-07-21",
    "w38-cdc-contraindications": "2024-07-25; current page reviewed 2026-07-21",
    "w38-cdc-administration": "current page reviewed 2026-07-21",
    "w38-cdc-vaccine-names": "2026-07-08",
    "w38-cdc-covid-current": "2025-11-04 (2025-2026 season)",
    "w38-cdc-rsv-infant-current": "2025-08-18",
    "w38-cdc-rsv-pregnancy-current": "current page reviewed 2026-07-21",
    "w38-cdc-rsv-adult-current": "2026-02-24; reflected in adult schedule amendment 2026-04-27",
    "w38-cdc-pneumococcal-current": "current page reviewed 2026-07-21",
    "w38-cdc-influenza-current": "2026-05-12; current-season product guidance",
    "w38-cdc-chikungunya-vaccine": "2026-01-23",
    "w38-fda-ixchiq-suspended": "2025-08-22; FDA content current 2025-08-25",
    "w38-cdc-dengue-vaccine": "2025-05-15; current page reviewed 2026-07-21"
  });
  sourceReferences.forEach((source) => {
    source.effectiveDate = sourceEffectiveDates[source.key] || "current page reviewed 2026-07-21";
    source.aniReviewDate = "2026-07-21";
  });

  const sourceByKey = new Map(sourceReferences.map((source) => [source.key, source]));
  const sourceIndex = new Map(database.sourceReferences
    .map((source, index) => [clean(source && source.key), index])
    .filter(([key]) => key));
  sourceReferences.forEach((source) => {
    const index = sourceIndex.get(source.key);
    if (Number.isInteger(index)) database.sourceReferences[index] = { ...source };
    else {
      sourceIndex.set(source.key, database.sourceReferences.length);
      database.sourceReferences.push({ ...source });
    }
  });

  const ALL_VACCINE_CARD_NAMES = Object.freeze([
    "Hepatitis B vaccine",
    "Rotavirus vaccine",
    "DTaP vaccine",
    "Haemophilus influenzae type b vaccine",
    "Pneumococcal conjugate vaccine",
    "Inactivated poliovirus vaccine",
    "COVID-19 vaccine",
    "Influenza vaccine",
    "MMR vaccine",
    "Varicella vaccine",
    "Hepatitis A vaccine",
    "Tdap vaccine",
    "Td vaccine",
    "Human papillomavirus vaccine",
    "Meningococcal ACWY vaccine",
    "Meningococcal B vaccine",
    "Meningococcal ABCWY combination vaccine",
    "Dengue vaccine",
    "Mpox vaccine",
    "Respiratory syncytial virus vaccine",
    "Nirsevimab",
    "Clesrovimab",
    "Pneumococcal polysaccharide vaccine",
    "Recombinant zoster vaccine",
    "DTaP-IPV combination vaccine",
    "DTaP-HepB-IPV combination vaccine",
    "DTaP-IPV-Hib combination vaccine",
    "DTaP-IPV-Hib-HepB combination vaccine",
    "Hepatitis A-Hepatitis B combination vaccine",
    "MMRV combination vaccine",
    "Adenovirus type 4 and 7 vaccine",
    "Anthrax vaccine",
    "Chikungunya vaccine",
    "Cholera vaccine",
    "Ebola vaccine",
    "Japanese encephalitis vaccine",
    "Rabies vaccine",
    "Typhoid vaccine",
    "Vaccinia and smallpox vaccine",
    "Yellow fever vaccine"
  ]);

  const timeline = Object.freeze([
    {
      sequence: 1,
      age: "Birth and the first week",
      class: "routine plus maternal-status/season-dependent",
      vaccines: ["Hepatitis B vaccine", "Nirsevimab", "Clesrovimab"],
      atThisAge: "Give dose 1 of Hepatitis B vaccine within 24 hours after birth.",
      text: "Give dose 1 of Hepatitis B vaccine within 24 hours after birth. If the birth parent is HBsAg-positive or status is unknown, give monovalent HepB and hepatitis B immune globulin in separate limbs within 12 hours; birth weight changes how the remaining series is counted. An eligible infant born during October through March should receive one long-acting RSV antibody, either Nirsevimab or Clesrovimab, ideally during the birth hospitalization, when maternal RSV vaccine was not given in the current pregnancy, status is unknown, or birth occurred within 14 days of maternal vaccination. Most infants do not need both maternal RSV vaccination and infant antibody."
    },
    {
      sequence: 2,
      age: "Age 1-2 months",
      class: "routine",
      vaccines: ["Hepatitis B vaccine"],
      atThisAge: "Give Hepatitis B vaccine dose 2 at age 1-2 months.",
      text: "Give Hepatitis B vaccine dose 2 at age 1-2 months. The interval from dose 1 must be at least 4 weeks when minimum catch-up spacing is being used. Combination products can change the total recorded dose count without changing the minimum age of 24 weeks for the final dose."
    },
    {
      sequence: 3,
      age: "Age 2 months",
      class: "routine pediatric primary series",
      vaccines: ["Rotavirus vaccine", "DTaP vaccine", "Haemophilus influenzae type b vaccine", "Pneumococcal conjugate vaccine", "Inactivated poliovirus vaccine"],
      atThisAge: "Begin Rotavirus vaccine, DTaP vaccine, Haemophilus influenzae type b vaccine, Pneumococcal conjugate vaccine, and Inactivated poliovirus vaccine.",
      memoryCue: {
        cue: "2 Be DR. HIP",
        meaning: "Use this as a recall cue for HepB, DTaP, rotavirus, Hib, IPV, and pneumococcal vaccination. HepB dose 2 has a 1-2 month window, and the actual product history still controls what is due."
      },
      text: "Begin Rotavirus vaccine, DTaP vaccine, Haemophilus influenzae type b vaccine, Pneumococcal conjugate vaccine, and Inactivated poliovirus vaccine."
    },
    {
      sequence: 4,
      age: "Age 4 months",
      class: "routine pediatric primary series",
      vaccines: ["Rotavirus vaccine", "DTaP vaccine", "Haemophilus influenzae type b vaccine", "Pneumococcal conjugate vaccine", "Inactivated poliovirus vaccine"],
      atThisAge: "Give the second routine doses of Rotavirus vaccine, DTaP vaccine, Haemophilus influenzae type b vaccine, Pneumococcal conjugate vaccine, and Inactivated poliovirus vaccine.",
      memoryCue: {
        cue: "4 DR. HIP",
        meaning: "Use this as a recall cue only after confirming the exact products, because Hib and rotavirus series length depends on product."
      },
      text: "Give the second routine doses of Rotavirus vaccine, DTaP vaccine, Haemophilus influenzae type b vaccine, Pneumococcal conjugate vaccine, and Inactivated poliovirus vaccine."
    },
    {
      sequence: 5,
      age: "Age 6 months",
      class: "routine plus season/product-dependent",
      vaccines: ["Hepatitis B vaccine", "Rotavirus vaccine", "DTaP vaccine", "Haemophilus influenzae type b vaccine", "Pneumococcal conjugate vaccine", "Inactivated poliovirus vaccine", "Influenza vaccine", "COVID-19 vaccine"],
      atThisAge: "Give DTaP dose 3 and PCV dose 3; product history determines whether additional Hib and rotavirus doses are due.",
      memoryCue: {
        cue: "Be DR. HIP IN 6",
        meaning: "Use this only as a recall cue. It is not a complete order because HepB and IPV use broader windows, Hib and rotavirus depend on product, and influenza and COVID recommendations depend on history and current guidance."
      },
      text: "Give DTaP dose 3 and PCV dose 3; give a third Hib primary dose when the product calls for it and a third rotavirus dose when RV5 or an unknown/mixed product was used. The third HepB and IPV doses fall within age 6-18 month windows, not one mandatory six-month date. Begin annual Influenza vaccine at age 6 months; children age 6 months-8 years may need 2 doses at least 4 weeks apart based on prior influenza history. COVID-19 vaccine is season-, product-, age-, and history-specific; use the current CDC COVID table rather than a memorized static dose count."
    },
    {
      sequence: 6,
      age: "Age 7-11 months",
      class: "complete age-appropriate series",
      vaccines: ["Hepatitis B vaccine", "Haemophilus influenzae type b vaccine", "Pneumococcal conjugate vaccine", "Inactivated poliovirus vaccine", "Influenza vaccine", "COVID-19 vaccine"],
      atThisAge: "Use the immunization record to complete due HepB, Hib, PCV, IPV, influenza, and current COVID-19 doses without restarting any delayed series.",
      text: "Use the immunization record to complete due HepB, Hib, PCV, IPV, influenza, and current COVID-19 doses without restarting any delayed series. This interval matters because routine windows overlap while catch-up intervals depend on the child's age when each earlier dose was given."
    },
    {
      sequence: 7,
      age: "Age 12-15 months",
      class: "routine toddler vaccines",
      vaccines: ["MMR vaccine", "Varicella vaccine", "Hepatitis A vaccine", "Haemophilus influenzae type b vaccine", "Pneumococcal conjugate vaccine", "DTaP vaccine", "Inactivated poliovirus vaccine"],
      atThisAge: "Give MMR vaccine dose 1, Varicella vaccine dose 1, and the Hib and PCV booster doses within their routine windows.",
      memoryCue: {
        cue: "Very MAD HIP-ster",
        meaning: "Use this to recall the toddler cluster, but do not compress MMR, varicella, HepA, DTaP, Hib, IPV, and pneumococcal age windows into one date."
      },
      text: "Give MMR vaccine dose 1 and Varicella vaccine dose 1 at age 12-15 months; give the Hib and PCV booster doses in that window. Start the 2-dose Hepatitis A vaccine series at age 12-23 months and separate its two doses by at least 6 months. DTaP dose 4 is routinely at 15-18 months, although it may sometimes be valid from 12 months if at least 6 months followed dose 3. IPV dose 3 may still be completed within its 6-18 month window."
    },
    {
      sequence: 8,
      age: "Age 15-23 months",
      class: "routine series completion",
      vaccines: ["DTaP vaccine", "Hepatitis A vaccine", "Hepatitis B vaccine", "Inactivated poliovirus vaccine"],
      atThisAge: "Give DTaP dose 4 at 15-18 months and finish the HepA series at least 6 months after dose 1.",
      text: "Give DTaP dose 4 at 15-18 months and finish the HepA series at least 6 months after dose 1. Complete valid HepB and IPV infant-series doses within their routine windows. Check the exact date intervals; a child can be chronologically old enough but still too close to the previous dose for that dose to count."
    },
    {
      sequence: 9,
      age: "Age 4-6 years",
      class: "routine school-entry boosters",
      vaccines: ["DTaP vaccine", "Inactivated poliovirus vaccine", "MMR vaccine", "Varicella vaccine"],
      atThisAge: "Give DTaP dose 5, the final IPV dose, MMR dose 2, and varicella dose 2 when prior doses meet validity rules.",
      memoryCue: {
        cue: "Very DIM between 4-6",
        meaning: "Use this to recall varicella, DTaP, IPV, and MMR. The actual dose is valid only when its minimum age and interval rules are met."
      },
      text: "Give DTaP dose 5, final IPV dose, MMR dose 2, and varicella dose 2. The final IPV dose must be given on or after the fourth birthday and at least 6 months after the preceding dose. DTaP dose 5 is unnecessary if dose 4 was given at age 4 years or older and at least 6 months after dose 3."
    },
    {
      sequence: 10,
      age: "Age 9-12 years",
      class: "routine adolescent prevention",
      vaccines: ["Human papillomavirus vaccine", "Tdap vaccine", "Meningococcal ACWY vaccine"],
      atThisAge: "Start or continue HPV vaccination, and give routine Tdap and MenACWY at age 11-12 years.",
      text: "Human papillomavirus vaccine may start at age 9 and is routinely recommended at 11-12 years. Starting before age 15 usually means 2 doses at 0 and 6-12 months, with a minimum 5-month interval; immunocompromised patients use 3 doses. Give one Tdap at age 11-12 years and MenACWY dose 1 at age 11-12 years."
    },
    {
      sequence: 11,
      age: "Age 13-18 years",
      class: "routine booster, catch-up, risk-based, and shared decision-making",
      vaccines: ["Meningococcal ACWY vaccine", "Meningococcal B vaccine", "Meningococcal ABCWY combination vaccine", "Human papillomavirus vaccine", "Tdap vaccine", "Td vaccine", "Dengue vaccine", "Mpox vaccine"],
      atThisAge: "Give the routine MenACWY booster at age 16 and complete HPV and Tdap/Td catch-up; MenB and other vaccines depend on risk or shared decision-making.",
      text: "Give the routine MenACWY booster at age 16. MenB vaccination for healthy adolescents and young adults age 16-23 is shared decision-making, with age 16-18 preferred; use the same MenB brand and normally separate 2 doses by at least 6 months. Complete HPV and Tdap/Td catch-up as indicated. Dengue vaccine is not routine for all adolescents: use only age 9-16 in an endemic area with laboratory-confirmed previous dengue infection, as a 3-dose series at 0, 6, and 12 months. Mpox vaccine is risk/exposure-based rather than a universal adolescent vaccine."
    },
    {
      sequence: 12,
      age: "Age 19-26 years",
      class: "routine adult continuation and catch-up",
      vaccines: ["COVID-19 vaccine", "Influenza vaccine", "Tdap vaccine", "Td vaccine", "Human papillomavirus vaccine", "Hepatitis B vaccine", "MMR vaccine", "Varicella vaccine", "Hepatitis A vaccine", "Inactivated poliovirus vaccine", "Meningococcal ACWY vaccine", "Meningococcal B vaccine", "Meningococcal ABCWY combination vaccine", "Haemophilus influenzae type b vaccine", "Mpox vaccine", "Pneumococcal conjugate vaccine"],
      atThisAge: "Continue influenza, current COVID guidance, and Td/Tdap; complete routine HPV and HepB and catch up other indicated vaccines.",
      text: "Continue annual influenza, current COVID guidance, and Td or Tdap every 10 years after at least one Tdap. Complete HPV through age 26 and HepB routinely through age 59. Complete MMR, varicella, HepA, and a 3-dose adult IPV primary series when evidence of vaccination or immunity is absent and the applicable indication is present. MenACWY, MenB, Hib, mpox, and pneumococcal vaccines are risk-, exposure-, living-setting-, immune-status-, or shared-decision dependent rather than universal for every person in this age band."
    },
    {
      sequence: 13,
      age: "Age 27-49 years",
      class: "routine continuation plus indications and shared decision-making",
      vaccines: ["Influenza vaccine", "COVID-19 vaccine", "Tdap vaccine", "Td vaccine", "Human papillomavirus vaccine", "Hepatitis B vaccine", "Hepatitis A vaccine", "MMR vaccine", "Varicella vaccine", "Pneumococcal conjugate vaccine", "Mpox vaccine"],
      atThisAge: "Continue influenza, current COVID guidance, and Td/Tdap; HPV and several other vaccines depend on history, risk, or shared decision-making.",
      text: "Continue annual influenza, current COVID guidance, and ten-year Td/Tdap boosters. HPV at age 27-45 uses shared clinical decision-making rather than routine catch-up. HepB remains routine through age 59. HepA, MMR, varicella, pneumococcal, mpox, meningococcal, Hib, and IPV recommendations depend on immunity, history, health condition, exposure, travel, occupation, or other indication."
    },
    {
      sequence: 14,
      age: "During pregnancy",
      class: "pregnancy-specific",
      vaccines: ["Tdap vaccine", "Influenza vaccine", "COVID-19 vaccine", "Respiratory syncytial virus vaccine", "MMR vaccine", "Varicella vaccine"],
      atThisAge: "Give Tdap during every pregnancy and follow current influenza, COVID-19, and seasonal maternal RSV guidance; live MMR and varicella are postponed until postpartum.",
      text: "Give Tdap during every pregnancy, preferably early in gestational weeks 27-36, because transplacental antibody protects the newborn before the infant can complete pertussis vaccination. Give age-appropriate inactivated influenza vaccine during any trimester in season and follow current COVID guidance. In most of the continental United States, one Abrysvo RSV dose at 32 weeks 0 days through 36 weeks 6 days during September-January is an option to protect the infant; it is not repeated in a later pregnancy under current guidance, so the later infant should receive RSV antibody. MMR and varicella are live vaccines and are not given during pregnancy; vaccinate postpartum when indicated."
    },
    {
      sequence: 15,
      age: "Age 50 years",
      class: "routine age-based adult vaccines",
      vaccines: ["Pneumococcal conjugate vaccine", "Pneumococcal polysaccharide vaccine", "Recombinant zoster vaccine"],
      atThisAge: "Review pneumococcal history and begin the 2-dose recombinant zoster vaccine series.",
      text: "If pneumococcal conjugate history is absent or unknown, give PCV15, PCV20, or PCV21. PCV20 or PCV21 generally completes the series; when PCV15 is used, give PPSV23 1 year later, with an 8-week minimum in selected high-risk situations. Begin the 2-dose recombinant zoster vaccine series at age 50 and separate doses by 2-6 months; the minimum interval is 4 weeks. Prior shingles or prior live zoster vaccine does not remove the RZV indication."
    },
    {
      sequence: 16,
      age: "Age 50-74 years",
      class: "risk-based adult RSV",
      vaccines: ["Respiratory syncytial virus vaccine"],
      atThisAge: "Give one RSV vaccine dose to an unvaccinated adult age 50-74 who is at increased risk for severe RSV disease.",
      text: "Give a single Respiratory syncytial virus vaccine dose to an unvaccinated adult age 50-74 who is at increased risk for severe RSV disease. It is not currently an annual vaccine. Late summer or early fall, usually August-October, provides the best pre-season timing in most of the continental United States."
    },
    {
      sequence: 17,
      age: "Age 60 years and older",
      class: "risk-based or requested HepB",
      vaccines: ["Hepatitis B vaccine"],
      atThisAge: "Give HepB when a risk factor is present; an adult without a known risk factor may also request protection.",
      text: "Adults age 60 or older with a hepatitis B risk factor should receive a HepB series, and an adult age 60 or older without a known risk factor may receive it when protection is requested. Product and dialysis status determine whether the series has 2, 3, or 4 doses."
    },
    {
      sequence: 18,
      age: "Age 65 years and older",
      class: "routine continuation with age-preferred influenza products",
      vaccines: ["Influenza vaccine", "COVID-19 vaccine", "Tdap vaccine", "Td vaccine", "Pneumococcal conjugate vaccine", "Recombinant zoster vaccine"],
      atThisAge: "Continue prior indications, prefer an age-recommended influenza product when available, and review completion of COVID, pneumococcal, zoster, and Td/Tdap protection.",
      text: "Continue all prior indications. For influenza, high-dose inactivated, recombinant, or adjuvanted inactivated vaccine is preferred when available; use another age-appropriate product rather than missing vaccination. Current COVID guidance uses age, history, formulation, and immune status and should be checked each season. Review completion of pneumococcal and zoster vaccination instead of automatically repeating a completed series."
    },
    {
      sequence: 19,
      age: "Age 75 years and older",
      class: "routine age-based adult RSV",
      vaccines: ["Respiratory syncytial virus vaccine"],
      atThisAge: "Give one RSV vaccine dose if it was not previously received, and continue all other applicable adult recommendations.",
      text: "Give one Respiratory syncytial virus vaccine dose if not previously received. Current CDC guidance does not recommend an annual RSV dose or a repeat dose after a prior adult RSV vaccination. Continue the influenza, COVID, Td/Tdap, pneumococcal, zoster, and risk-based recommendations that remain applicable."
    }
  ]);

  const recommendationClasses = Object.freeze({
    routine: "A routine recommendation applies to everyone in the stated age or physiologic group who lacks a valid dose or evidence of immunity. The preferred routine interval optimizes protection and visit timing.",
    catchUp: "Catch-up guidance is for a late or incomplete series. Use minimum ages and minimum intervals only when needed, validate every prior dose, and never restart a valid series solely because time elapsed.",
    riskBased: "A risk-based recommendation applies because disease, anatomy, medication, immune status, exposure, travel, occupation, pregnancy, residence, or another condition changes the likelihood or consequence of infection.",
    sharedDecisionMaking: "Shared or individual-based decision-making is not the same as a universal recommendation. Patient values, prior exposure, future risk, benefit, uncertainty, and product-specific harms are discussed before deciding."
  });

  const catchUpEssentials = Object.freeze([
    "HepB: dose 1 to 2 at least 4 weeks; dose 2 to 3 at least 8 weeks; dose 1 to final dose at least 16 weeks; final dose at age 24 weeks or older.",
    "Rotavirus: at least 4 weeks between doses; do not start at age 15 weeks or older; finish by age 8 months 0 days.",
    "DTaP: minimum intervals 4 weeks, 4 weeks, 6 months, then 6 months; dose 5 is unnecessary when a valid dose 4 occurred at age 4 years or older and at least 6 months after dose 3.",
    "IPV: 4 weeks between early doses and 6 months before the final dose; the final dose must be at age 4 years or older.",
    "MMR: 2 catch-up doses at least 4 weeks apart. Varicella: 3 months apart when younger than 13 years and at least 4 weeks apart at age 13 or older.",
    "HepA: 2 antigen-specific doses at least 6 months apart. Adult combination HepA-HepB schedules are product-specific.",
    "Tdap/Td primary catch-up: Tdap now, Td or Tdap at least 4 weeks later, and a final Td or Tdap 6-12 months later, then every 10 years.",
    "HPV: start age 9-14 with 2 doses at 0 and 6-12 months, minimum 5 months; start age 15 or older or immunocompromised with 3 doses at 0, 1-2, and 6 months, subject to minimum intervals.",
    "MenACWY: when a two-dose primary or catch-up series is indicated, the minimum interval is generally 8 weeks. MenB product and indication determine a 2- or 3-dose series; do not interchange brands.",
    "Hib and pneumococcal catch-up depend on current age, age at each prior dose, product, and risk condition; use the CDC tables or decision support rather than a single memorized interval.",
    "Prior-dose validity: if a prior dose was early, undocumented, outside product age limits, or given by a nonstandard route, evaluate that dose specifically rather than discarding or accepting the whole series."
  ]);

  const vaccineSpecs = [
    {
      name: "Nirsevimab",
      isVaccine: false,
      aliases: ["infant RSV antibody nirsevimab", "nirsevimab RSV monoclonal antibody", "Beyfortus", "RSV shot for newborn", "RSV shot for baby", "RSV immunization for baby", "first season RSV antibody"],
      abbreviations: ["RSV-mAb (nirsevimab)"],
      brands: ["Beyfortus"],
      commonMisspellings: ["nirsevamab", "nersivimab", "nirsevimab shot", "nirsevimab antibody vaccine"],
      platform: "Long-acting, laboratory-produced monoclonal antibody against the prefusion RSV F protein; Nirsevimab is passive immunization, not a vaccine.",
      protectsAgainst: "Severe respiratory syncytial virus lower-respiratory disease and hospitalization during the protected season; it does not treat active RSV infection.",
      mechanism: "The injected antibody is already shaped to bind a conserved site on RSV prefusion F protein. Binding blocks the conformational fusion step the virus needs to enter airway cells. Protection begins without waiting for the infant to build an adaptive response, which is why this strategy works in very young infants whose own vaccine response and maternal antibody supply may be limited. Because the infant is receiving antibody rather than antigen, immune memory is not created and protection wanes as the antibody is cleared.",
      routineSchedule: "For an infant younger than 8 months born during or entering the first RSV season, give one Nirsevimab dose when the mother did not receive maternal RSV vaccine in the current pregnancy, status is unknown, or the infant was born within 14 days after maternal vaccination. In most of the continental United States, give during October-March: within the first week of life for a birth during that window, or shortly before the season for a child born April-September. Most infants born at least 14 days after maternal vaccination do not also need antibody.",
      catchUpMinimums: "There is no multi-dose catch-up series for routine first-season protection. Give an eligible child at the earliest seasonal opportunity. Nirsevimab may be given once before the second season to certain high-risk children age 8-19 months.",
      riskBased: "Second-season nirsevimab applies to age 8-19 months with chronic lung disease of prematurity requiring recent medical support, severe immunocompromise, specified severe cystic-fibrosis features, or American Indian/Alaska Native identity. Rare infants born to a vaccinated mother may still merit antibody when maternal response or antibody transfer was impaired, antibody was lost through bypass/ECMO/exchange transfusion, or the infant has extraordinary risk.",
      sharedDecisionMaking: "For most families the practical choice is maternal Abrysvo during the recommended pregnancy window or an infant antibody after birth, not both. Discuss timing, likely access, local RSV season, maternal-vaccine history, and the infant's risk. This is a preference-sensitive choice within CDC guidance, but product eligibility remains objective.",
      doseCountAndSpacing: "One first-season dose: 50 mg for weight under 5 kg or 100 mg for weight 5 kg or more. Selected second-season children age 8-19 months receive 200 mg as two 100-mg injections. No interval from routine vaccines is required.",
      doseVolumeSafety: "Nirsevimab volume follows the labeled 50-mg/0.5-mL or 100-mg/1-mL syringe; the 200-mg dose requires two separate 100-mg/1-mL injections. Verify Nirsevimab, concentration, age, weight, syringe, number of injections, IM route, and current package label before administration; milligrams are not interchangeable with milliliters.",
      route: "Intramuscular, preferably in the anterolateral thigh for an infant. Do not give intravenously, intradermally, or subcutaneously.",
      contraindications: "History of a severe allergic reaction to Nirsevimab or one of its components.",
      precautions: "Moderate or severe acute illness is generally a reason to wait until recovery. Recheck maternal RSV vaccination date, infant age on administration day, current weight for nirsevimab, seasonal eligibility, and whether antibody was already given. Do not substitute clesrovimab for second-season nirsevimab.",
      adverseEffects: "Injection-site pain, redness, or swelling are usually mild. Hypersensitivity is uncommon but possible. A new illness after administration may be coincidental; assess the pattern rather than assuming causality.",
      pregnancy: "The recipient is an infant or young child. Maternal RSV vaccination status is central to eligibility. The antibody is not a substitute product for injection into a pregnant patient.",
      immunocompromise: "Severe immunocompromise can create a second-season nirsevimab indication and can support rare use after maternal vaccination when protection may be inadequate. It does not remove the need to verify product age limits.",
      nursingFocus: "Confirm birth date, gestational history, exact maternal Abrysvo date, local RSV season, current weight, prior RSV antibody, cardiac-bypass/ECMO history, and high-risk conditions. Use a separate site from coadministered vaccines and teach caregivers that this prevents severe RSV but does not prevent every respiratory illness.",
      urgentEscalation: "Treat airway swelling, wheeze, respiratory distress, hypotension, diffuse hives, or rapidly progressive symptoms as possible anaphylaxis. Report an adverse event after antibody alone through FDA MedWatch; when antibody and vaccine were coadministered and the event follows that visit, follow current CDC reporting instructions, including VAERS where applicable.",
      pitfalls: "Calling this a vaccine is mechanistically wrong. Do not give both maternal protection and infant antibody by reflex, do not use clesrovimab for a second RSV season, do not calculate nirsevimab from age without weight, and do not assume a single antibody dose creates lasting immune memory.",
      related: ["Clesrovimab", "Respiratory syncytial virus vaccine", "Influenza vaccine", "COVID-19 vaccine"],
      sourceKeys: ["w38-cdc-rsv-infant-current", "w38-cdc-rsv-pregnancy-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Clesrovimab",
      isVaccine: false,
      aliases: ["infant RSV antibody clesrovimab", "clesrovimab RSV monoclonal antibody", "Enflonsia", "fixed dose RSV antibody", "RSV antibody for first season"],
      abbreviations: ["RSV-mAb (clesrovimab)"],
      brands: ["Enflonsia"],
      commonMisspellings: ["clesrovamab", "clesrovimab shot", "enflonisa", "clesrovimab antibody vaccine"],
      platform: "Long-acting monoclonal antibody that supplies passive neutralizing activity against RSV prefusion F protein; Clesrovimab is an immunizing agent but not a vaccine.",
      protectsAgainst: "Severe RSV lower-respiratory tract disease and hospitalization in an eligible infant during the first RSV season. It is preventive, not treatment for established RSV infection.",
      mechanism: "Clesrovimab provides a ready-made antibody that binds a conserved prefusion F-protein epitope and blocks membrane fusion, preventing RSV from entering airway cells. This bypasses the weeks normally required to generate vaccine-induced immunity and gives an infant immediate seasonal protection. Because no antigen-driven memory response is created, protection declines as the administered antibody is metabolized.",
      routineSchedule: "Give one dose to an eligible infant younger than 8 months who is born during or entering the first RSV season when maternal Abrysvo was not given in the current pregnancy, maternal status is unknown, or the infant was born within 14 days after vaccination. In most of the continental United States, administer October-March, ideally during the birth hospitalization for an October-March birth or shortly before the season for an April-September birth.",
      catchUpMinimums: "There is no series to restart and no routine second dose. Give at the earliest seasonal opportunity while the infant remains younger than 8 months and otherwise eligible. Clesrovimab is not approved or recommended for children entering a second RSV season; use Nirsevimab only for the defined high-risk age 8-19 month group.",
      riskBased: "The main first-season eligibility decision uses maternal vaccination status, timing, infant age, and local season. Rare use after adequate maternal vaccination may be considered when maternal immune response or placental transfer was impaired, transferred antibody was lost, or the infant has exceptional risk.",
      sharedDecisionMaking: "Families can discuss maternal Abrysvo versus an infant antibody before delivery. Once an infant product is chosen, Clesrovimab and Nirsevimab have different labeled doses, weight logic, and second-season status and must not be treated as interchangeable syringes.",
      doseCountAndSpacing: "One 105-mg dose for every eligible infant younger than 8 months, regardless of weight. It may be coadministered with routine childhood vaccines at a separate site; no interval from live or nonlive vaccines is required.",
      doseVolumeSafety: "Clesrovimab is supplied as 105 mg/0.7 mL for IM use. Verify the exact product name Enflonsia/Clesrovimab, concentration, full 0.7-mL labeled dose, infant age, IM route, expiration, and package instructions. Do not substitute the weight-based Nirsevimab volumes or split the dose unofficially.",
      route: "Intramuscular, preferably in the anterolateral thigh. Use a different anatomic site from coadministered vaccines when feasible.",
      contraindications: "Severe allergic reaction to Clesrovimab or a component.",
      precautions: "Moderate or severe acute illness is generally a reason to wait. Reconcile maternal RSV vaccine timing and any prior infant RSV antibody. Do not use at age 8 months or older and do not use for second-season protection.",
      adverseEffects: "Injection-site redness, swelling, or pain is usually mild. Hypersensitivity reactions are uncommon but possible.",
      pregnancy: "Clesrovimab is administered to the infant, not the pregnant patient. Its eligibility is coordinated with maternal Abrysvo timing.",
      immunocompromise: "Severe infant immune compromise can heighten the need for RSV protection, but it does not extend Clesrovimab beyond the first-season age indication. A high-risk child entering a second season uses the Nirsevimab pathway.",
      nursingFocus: "Confirm age on the administration date, current RSV season, exact maternal Abrysvo date, prior infant antibody, and high-risk history. Document the antibody as an immunizing agent with product, dose in mg and mL, lot, route, site, and next-season status; teach that it is not an annual childhood vaccine.",
      urgentEscalation: "Treat airway swelling, wheeze, hypotension, diffuse hives, or rapid respiratory compromise as possible anaphylaxis. Report antibody-alone adverse events through FDA MedWatch; follow current CDC reporting guidance when coadministered with vaccines.",
      pitfalls: "Do not call Clesrovimab a vaccine, do not use a Nirsevimab weight table, do not give it for the second season, do not use it after age 8 months, and do not routinely duplicate adequate maternal RSV protection.",
      related: ["Nirsevimab", "Respiratory syncytial virus vaccine", "Influenza vaccine"],
      sourceKeys: ["w38-cdc-rsv-infant-current", "w38-cdc-rsv-pregnancy-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Hepatitis B vaccine",
      aliases: ["HepB vaccine", "hepatitis B shot", "hep B shot", "Engerix-B", "Recombivax HB", "Heplisav-B", "HBV vaccine"],
      abbreviations: ["HepB", "HBV vaccine"],
      brands: ["Engerix-B", "Recombivax HB", "Heplisav-B"],
      commonMisspellings: ["hepititis B vaccine", "hepatitus B shot", "hep b vacine"],
      platform: "Recombinant hepatitis B surface antigen vaccine; combination HepA-HepB and pediatric combination products may supply a HepB component.",
      protectsAgainst: "Hepatitis B infection and its consequences, including chronic hepatitis, cirrhosis, liver failure, and hepatocellular carcinoma. The birth dose also closes the narrow window in which unrecognized perinatal exposure can establish chronic infection.",
      mechanism: "Recombinant hepatitis B surface antigen is taken up by antigen-presenting cells and shown to helper T cells, which support B-cell production of anti-HBs antibodies and immune memory. Those antibodies bind surface antigen on incoming HBV and prevent productive infection of hepatocytes. Infants infected around birth are especially likely to develop chronic infection because immune clearance is immature, explaining why rapid post-birth protection and HBIG for a documented or possible maternal source matter.",
      routineSchedule: "Infants: monovalent dose 1 within 24 hours of birth, dose 2 at age 1-2 months, and final dose at age 6-18 months, never before age 24 weeks. Maternal HBsAg-positive or unknown status requires vaccine within 12 hours and HBIG in a separate limb, with birth-weight-specific follow-up and post-vaccination testing. Adults age 19-59: complete a licensed 2-, 3-, or 4-dose product schedule. Adults age 60 or older with risk should receive a series; those without a known risk may receive it on request.",
      catchUpMinimums: "For a standard 3-dose series: dose 1 to 2 at least 4 weeks, dose 2 to 3 at least 8 weeks, and dose 1 to final dose at least 16 weeks; infant final dose minimum age is 24 weeks. Heplisav-B is a 2-dose adult series at least 4 weeks apart. Twinrix may use 0, 1, 6 months or its licensed accelerated schedule. A late series is continued, not restarted.",
      riskBased: "Risk includes chronic liver disease, HIV, sexual or household exposure, injection-drug use, blood exposure, incarceration, travel to higher-endemicity settings, diabetes in selected older adults, dialysis/predialysis, and occupational exposure. Dialysis uses high-antigen-dose product schedules and post-vaccination serology.",
      sharedDecisionMaking: "Age 60 or older without a known risk may choose vaccination after discussion; a person requesting protection should not be required to disclose a risk. Product selection can be preference- and access-sensitive, but age, pregnancy, dialysis, and prior product constrain the valid schedule.",
      doseCountAndSpacing: "Infant routine series is commonly 3 doses, but combination products can produce a valid 4-dose record. Adult options include Heplisav-B 2 doses at least 4 weeks apart; Engerix-B or Recombivax HB 3 doses at 0, 1, and 6 months; Twinrix 3 or accelerated 4 doses. Dialysis schedules are product-specific.",
      doseVolumeSafety: "The mL volume and antigen amount vary sharply by age, brand, combination product, and dialysis formulation. For example, a dialysis formulation or double-volume adult regimen is not the standard adult dose. Verify product, antigen content, formulation label, age, dialysis status, and standing order; never infer volume from the words 'HepB dose.'",
      route: "Intramuscular. Use the anterolateral thigh for most infants and the deltoid for older children and adults when muscle mass is adequate; follow bleeding-risk technique when needed.",
      contraindications: "Severe allergic reaction after a prior HepB dose or to a vaccine component, including a relevant yeast allergy for yeast-derived products.",
      precautions: "Moderate or severe acute illness. Verify maternal HBsAg status, birth weight, HBIG timing, product interchangeability, minimum age, and recent dose dates. A low anti-HBs result has meaning only in populations for whom post-vaccination testing is recommended and when timed correctly.",
      adverseEffects: "Injection-site soreness and fever are common expected reactions. Syncope can follow any injection. Serious allergy is rare.",
      pregnancy: "Pregnancy is not a contraindication to indicated HepB vaccination. Select a product supported by current pregnancy guidance and do not rely on obsolete product notes.",
      immunocompromise: "Immune response can be lower. Dialysis and selected immunocompromised patients need specific formulations or schedules, post-vaccination serology, and sometimes revaccination under current guidance.",
      nursingFocus: "For every newborn, reconcile maternal laboratory results rather than accepting a verbal 'negative.' Time-stamp vaccine and HBIG separately, use separate limbs, arrange the remaining series, and ensure indicated HBsAg/anti-HBs testing at age 9-12 months. For adults, identify dialysis, diabetes, liver disease, exposure, occupation, travel, pregnancy, and prior product.",
      urgentEscalation: "Treat possible anaphylaxis immediately. Escalate a newborn whose maternal status is positive, unknown, missing, or discovered after birth because prophylaxis timing is critical. Report clinically significant vaccine events through VAERS according to policy.",
      pitfalls: "Do not count a final infant dose before 24 weeks; do not omit HBIG when indicated; do not restart because of delay; do not interpret absence of a documented risk as absence of risk; and do not apply standard adult volume to dialysis formulations.",
      related: ["Hepatitis A vaccine", "DTaP vaccine", "Inactivated poliovirus vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Rotavirus vaccine",
      aliases: ["RV vaccine", "rotavirus oral vaccine", "RotaTeq", "Rotarix", "RV1", "RV5", "baby rotavirus drops"],
      abbreviations: ["RV", "RV1", "RV5"],
      brands: ["Rotarix (RV1)", "RotaTeq (RV5)"],
      commonMisspellings: ["rotovirus vaccine", "rota virus drops", "rotavirus vacine"],
      platform: "Live attenuated oral rotavirus vaccine; RV1 and RV5 contain different attenuated strain compositions and use different series lengths.",
      protectsAgainst: "Severe rotavirus gastroenteritis, dehydration, emergency visits, and hospitalization in infancy. It does not prevent every diarrheal illness because many pathogens cause gastroenteritis.",
      mechanism: "Attenuated vaccine virus briefly replicates in the intestinal mucosa without causing typical severe disease in an immunocompetent infant. Local IgA, systemic antibody, and memory responses then recognize wild rotavirus earlier and limit enterocyte infection, villous injury, secretory diarrhea, vomiting, and fluid loss. Oral delivery targets the same mucosal compartment used by natural infection, explaining both the route and the strict safety exclusions for severe immune deficiency.",
      routineSchedule: "Start at age 2 months. Rotarix is a 2-dose series at 2 and 4 months. RotaTeq is a 3-dose series at 2, 4, and 6 months. If any dose was RotaTeq or the prior product is unknown, complete a 3-dose series. Do not start on or after age 15 weeks 0 days, and give the final dose by age 8 months 0 days.",
      catchUpMinimums: "Minimum age is 6 weeks and minimum interval is 4 weeks. The maximum age for dose 1 is 14 weeks 6 days; maximum age for any final dose is 8 months 0 days. These upper limits mean a missed opportunity cannot always be caught up later.",
      riskBased: "The schedule is routine for eligible infants. Prematurity by itself is not a contraindication when the infant is clinically stable and age-eligible. Household pregnancy or immunocompromise is not a reason to withhold the infant's vaccine; careful diaper hand hygiene reduces contact with shed vaccine virus.",
      sharedDecisionMaking: "No routine shared-decision category applies. Eligibility is governed by age, product history, and contraindications.",
      doseCountAndSpacing: "Rotarix: 2 oral doses, normally 2 and 4 months. RotaTeq: 3 oral doses, normally 2, 4, and 6 months. Mixed or unknown product: default to 3 total doses, each at least 4 weeks apart and all within age limits.",
      doseVolumeSafety: "This is oral liquid and product volumes differ. Use the complete manufacturer-supplied oral applicator or dosing tube for the selected brand; verify product, labeled volume, lot, age, and expiration. Do not convert it into an injection or substitute one brand's volume for the other.",
      route: "Oral only. Administer gently toward the inside of the cheek with the infant supported; never inject rotavirus vaccine.",
      contraindications: "Severe allergy after a prior dose or to a component, severe combined immunodeficiency, or a history of intussusception.",
      precautions: "Moderate or severe acute illness, acute moderate/severe gastroenteritis, or certain chronic gastrointestinal conditions warrant individualized review. Verify age to the day. If an infant spits or regurgitates, do not automatically repeat the dose; follow current product and CDC guidance.",
      adverseEffects: "Mild temporary irritability, diarrhea, or vomiting may occur. Intussusception is a rare but time-sensitive adverse event, most often considered in the week after an early dose.",
      pregnancy: "The recipient is an infant. A pregnant household contact is not a contraindication; use careful hand hygiene after diaper changes because vaccine virus can be shed in stool.",
      immunocompromise: "SCID is a contraindication. Other suspected immune deficits require specialist review because this is a replicating live vaccine. An immunocompromised household contact is not automatically a contraindication, but hygiene teaching matters.",
      nursingFocus: "Screen specifically for SCID, prior intussusception, age in weeks and days, product history, current GI illness, and allergy. Document oral route and teach caregivers to watch for episodic severe crying, drawing knees up, repeated vomiting, lethargy, or bloody stool.",
      urgentEscalation: "Possible anaphylaxis requires emergency treatment. Symptoms suggesting intussusception need urgent evaluation rather than reassurance as ordinary post-vaccine fussiness.",
      pitfalls: "Do not confuse Rotarix with RotaTeq series length, do not begin after the upper age limit, do not inject the product, do not repeat a regurgitated dose without guidance, and do not call all later diarrhea a vaccine reaction.",
      related: ["DTaP vaccine", "Haemophilus influenzae type b vaccine", "Pneumococcal conjugate vaccine"],
      sourceKeys: ["w38-cdc-child-age-current", "w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-vaccine-names", "w38-cdc-contraindications"]
    },
    {
      name: "DTaP vaccine",
      aliases: ["diphtheria tetanus acellular pertussis vaccine", "DTaP shot", "Daptacel", "Infanrix", "baby whooping cough vaccine", "pediatric tetanus pertussis vaccine"],
      abbreviations: ["DTaP"],
      brands: ["Daptacel", "Infanrix"],
      commonMisspellings: ["DTPa vaccine", "DTAP vacine", "diptheria tetanus pertussis vaccine"],
      platform: "Nonlive combination of diphtheria and tetanus toxoids with purified acellular pertussis antigens; pediatric antigen formulation for children younger than 7 years.",
      protectsAgainst: "Diphtheria toxin disease, tetanus toxin disease, and severe pertussis. Protection against pertussis infection is not absolute and wanes, but vaccination markedly reduces severe infant disease and complications.",
      mechanism: "Toxoids are chemically inactivated toxins that retain antigen shape, so antibodies can later neutralize active diphtheria or tetanus toxin before it binds tissue. Acellular pertussis proteins generate antibody and T-cell responses against bacterial attachment and toxin-related virulence. Multiple infant doses prime and expand memory while later boosters restore declining circulating antibody, explaining the clustered primary series and preschool booster.",
      routineSchedule: "Five-dose pediatric series at 2, 4, 6, 15-18 months, and 4-6 years. Dose 4 may be given from age 12 months if at least 6 months followed dose 3. Dose 5 is unnecessary if dose 4 occurred at age 4 years or older and at least 6 months after dose 3. At age 7 or older, use Tdap/Td catch-up rather than continuing routine DTaP.",
      catchUpMinimums: "Minimum age 6 weeks. Minimum intervals are 4 weeks from dose 1 to 2, 4 weeks from dose 2 to 3, 6 months from dose 3 to 4, and 6 months from dose 4 to 5. Age at prior doses determines whether a fifth dose is needed. Use CDC catch-up job aids for children near the age-7 transition.",
      riskBased: "DTaP is routine, with additional wound-management considerations for tetanus protection in children younger than 7. Exposure to pertussis does not replace evaluation for antimicrobial prophylaxis or treatment.",
      sharedDecisionMaking: "No routine shared-decision category applies. Contraindications may require a formulation without pertussis antigen under expert guidance.",
      doseCountAndSpacing: "Normally 5 IM doses across infancy and preschool years. Valid combination products can provide one or more components, so count antigen-specific doses and dates rather than simply counting injections.",
      doseVolumeSafety: "Single-antigen DTaP products are generally supplied as a labeled pediatric IM dose, but combination products, presentations, and preparation steps differ. Verify the exact product, age indication, component history, labeled volume, and whether reconstitution is required; never substitute Tdap volume or formulation based on similar lettering.",
      route: "Intramuscular; use an age-appropriate site and needle. DTaP given by the wrong route may not be valid and can increase local reactions.",
      contraindications: "Severe allergy after a prior dose/component, or encephalopathy not attributable to another cause within 7 days after a previous pertussis-containing vaccine.",
      precautions: "Progressive or unstable neurologic disorder until clarified/stabilized, Guillain-Barre syndrome within 6 weeks after a tetanus-toxoid vaccine, Arthus-type reaction after tetanus/diphtheria toxoid with deferral for at least 10 years, or moderate/severe acute illness. Stable neurologic disease and a family history of seizures are not automatic contraindications.",
      adverseEffects: "Pain, redness, swelling, fussiness, fatigue, appetite change, and fever can occur. Extensive limb swelling, febrile seizure, hypotonic-hyporesponsive episode, or prolonged crying is uncommon and needs assessment, but the history alone is not always an absolute contraindication.",
      pregnancy: "DTaP is a pediatric product, not the pregnancy formulation. Use Tdap during each pregnancy according to adult guidance.",
      immunocompromise: "Because DTaP is nonlive, immunocompromise is not a live-vaccine contraindication, although response may be reduced. Continue indicated vaccination while coordinating timing around immune-suppressive therapy.",
      nursingFocus: "Reconstruct antigen-specific history from combination products; screen for prior encephalopathy, unstable neurologic symptoms, severe allergy, Arthus reaction, and GBS timing. Explain expected fever/local swelling and teach the distinction between a routine reaction and altered consciousness, respiratory compromise, or persistent seizure.",
      urgentEscalation: "Treat anaphylaxis immediately. Escalate encephalopathy, prolonged seizure, unresponsiveness, respiratory compromise, shock-like state, or other severe neurologic change. Report qualifying adverse events through VAERS.",
      pitfalls: "DTaP and Tdap are not interchangeable age labels. Do not count injection number without checking combination antigens, do not give dose 5 when a valid age-4 dose 4 already completes the series, and do not label every post-vaccine fever as encephalopathy.",
      related: ["Tdap vaccine", "Td vaccine", "Haemophilus influenzae type b vaccine", "Inactivated poliovirus vaccine", "Hepatitis B vaccine"],
      sourceKeys: ["w38-cdc-child-age-current", "w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-contraindications", "w38-cdc-vaccine-names"]
    },
    {
      name: "Haemophilus influenzae type b vaccine",
      aliases: ["Hib vaccine", "Haemophilus type b vaccine", "ActHIB", "Hiberix", "PedvaxHIB", "H flu type b shot"],
      abbreviations: ["Hib", "PRP-T", "PRP-OMP"],
      brands: ["ActHIB", "Hiberix", "PedvaxHIB"],
      commonMisspellings: ["hemophilus influenza vaccine", "haemopholis b vaccine", "HIB vacine"],
      platform: "Capsular polyribosylribitol phosphate polysaccharide conjugated to a carrier protein; products use different carriers and primary-series lengths.",
      protectsAgainst: "Invasive Hib disease, especially meningitis, epiglottitis, bacteremia, pneumonia, septic arthritis, and other serious infection. It does not protect against influenza virus and does not cover every non-type-b Haemophilus strain.",
      mechanism: "An unconjugated bacterial capsule is a weak T-cell-independent antigen in young infants. Linking Hib capsule polysaccharide to a protein lets antigen-presenting cells recruit helper T cells, drive class-switched high-affinity antibody, and form memory B cells. Anticapsular antibody promotes complement and opsonophagocytic clearance before Hib invades the bloodstream, explaining both infant effectiveness and the booster that recalls memory.",
      routineSchedule: "Begin at age 2 months. PRP-T products generally use primary doses at 2, 4, and 6 months plus a booster at 12-15 months. PedvaxHIB uses primary doses at 2 and 4 months plus the 12-15 month booster. Combination product history determines whether a 6-month primary dose is due.",
      catchUpMinimums: "Minimum age is 6 weeks. Catch-up varies with current age, age at each prior dose, and product. A first dose at age 15 months or older often completes routine catch-up for a healthy child; younger children may need 4- or 8-week intervals and a final dose at age 12-59 months. Use the CDC Hib catch-up table rather than one universal interval.",
      riskBased: "Older children and adults usually do not need routine Hib, but anatomic/functional asplenia, sickle cell disease, elective splenectomy, and hematopoietic stem-cell transplant can create indications. HSCT recipients receive a new 3-dose series 4 weeks apart beginning 6-12 months after successful transplant regardless of earlier Hib history.",
      sharedDecisionMaking: "No universal shared-decision category applies. Risk-based decisions should follow spleen status, transplant status, prior series, and timing of planned splenectomy.",
      doseCountAndSpacing: "Routine total is 3 or 4 doses depending on product: two- or three-dose infant primary series plus one booster at 12-15 months. Catch-up dose count decreases as an immunocompetent child gets older; HSCT uses a separate 3-dose post-transplant series.",
      doseVolumeSafety: "Hib products and combination vaccines differ in reconstitution, carrier, approved ages, and components even when the final IM dose is commonly labeled 0.5 mL. Verify brand, diluent, lot, age, prior product, and current package instructions; do not assume that every Hib-containing combination supplies every due antigen.",
      route: "Intramuscular using an age-appropriate site. Follow the specific product instructions for reconstitution before injection.",
      contraindications: "Severe allergic reaction after a prior dose or to a component. Hib vaccine is not administered to an infant younger than 6 weeks because early dosing can induce immune tolerance rather than useful protection.",
      precautions: "Moderate or severe acute illness. Catch-up interpretation becomes unsafe when the earlier brand or age is missing; obtain the immunization record when possible and use the unknown-product pathway when it is not.",
      adverseEffects: "Local redness, warmth, swelling, or soreness and transient fever or irritability are typical. Serious allergy is rare.",
      pregnancy: "Routine pregnancy vaccination is not indicated. If a pregnant person has a special high-risk indication, consult current CDC and specialist guidance rather than extrapolating the pediatric series.",
      immunocompromise: "Asplenia and HSCT create special indications because encapsulated organisms are more dangerous and prior immune memory may be lost after transplant. Other immune deficits may reduce response but Hib is nonlive.",
      nursingFocus: "Identify the exact Hib carrier/product, combination doses, age at administration, spleen status, sickle cell disease, and transplant history. Before elective splenectomy, coordinate indicated vaccination preferably at least 14 days in advance when feasible. Teach that Hib is bacterial and unrelated to seasonal influenza.",
      urgentEscalation: "Treat anaphylaxis immediately. In an asplenic patient, fever or signs of invasive infection remain urgent even after vaccination because no vaccine eliminates sepsis risk.",
      pitfalls: "Do not confuse Hib with influenza vaccine, do not force a four-dose schedule onto PedvaxHIB history, do not apply infant catch-up rules to HSCT, and do not assume vaccination makes fever in asplenia low risk.",
      related: ["Pneumococcal conjugate vaccine", "Meningococcal ACWY vaccine", "DTaP vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Pneumococcal conjugate vaccine",
      aliases: ["PCV vaccine", "pneumococcal conjugate shot", "PCV15", "PCV20", "PCV21", "Vaxneuvance", "Prevnar 20", "Capvaxive", "pneumonia conjugate vaccine"],
      abbreviations: ["PCV", "PCV15", "PCV20", "PCV21"],
      brands: ["Vaxneuvance (PCV15)", "Prevnar 20 (PCV20)", "Capvaxive (PCV21)"],
      commonMisspellings: ["pneumococal vaccine", "neumococcal conjugate vaccine", "PCV vacine"],
      platform: "Selected Streptococcus pneumoniae capsular polysaccharides conjugated to a carrier protein; valency identifies the number of serotypes represented, not a simple ranking of potency.",
      protectsAgainst: "Invasive pneumococcal disease and a portion of pneumococcal pneumonia, meningitis, bacteremia, and otitis caused by vaccine serotypes. It cannot prevent disease from every pneumococcal serotype or every cause of pneumonia.",
      mechanism: "Conjugation converts capsular polysaccharide into a T-cell-dependent antigen. Helper T cells support high-affinity anticapsular antibody, memory B cells, and a booster response even in infancy. Antibody coats the capsule, restoring complement deposition and phagocyte recognition that the organism's slippery capsule otherwise impairs. Serotype composition matters because antibody is type-specific.",
      routineSchedule: "Children: PCV15 or PCV20 at 2, 4, 6, and 12-15 months. Adults age 50 or older with no prior PCV or unknown history: one PCV15, PCV20, or PCV21; if PCV15 is used, PPSV23 follows, usually after 1 year. PCV20 or PCV21 generally completes the adult series. Product and prior PCV/PPSV23 history determine later recommendations.",
      catchUpMinimums: "Healthy children age 2-4 years with an incomplete PCV series generally need catch-up; exact doses and 4- versus 8-week intervals depend on current age and age at prior doses. Adults receiving PCV15 usually receive PPSV23 1 year later; an 8-week minimum can be used for immunocompromise, cochlear implant, or CSF leak. Use CDC decision support for complex histories.",
      riskBased: "Age 19-49 with alcoholism, smoking, chronic heart/lung/liver disease, diabetes, chronic renal failure, nephrotic syndrome, immunocompromise, malignancy, HIV, asplenia/sickle cell disease, cochlear implant, or CSF leak can need vaccination before age 50. Pediatric risk schedules also vary by condition and prior products.",
      sharedDecisionMaking: "Selected adults with older completed PCV13/PPSV23 histories may use shared decision-making for PCV20 or PCV21. This is not a blanket instruction to revaccinate everyone; serotype coverage, prior dates, risk, and age matter.",
      doseCountAndSpacing: "Routine child series is 4 doses. Many adults need one PCV20 or PCV21 only; PCV15 creates a two-product sequence with PPSV23. Prior PCV13, PCV15, PCV20, PCV21, and PPSV23 combinations require individualized interval review.",
      doseVolumeSafety: "Products are not interchangeable merely because they are all PCV, and labeled age indications can change. Verify exact valency, brand, age, history, labeled IM dose, and whether PPSV23 is still due. Do not calculate a dose volume from valency or combine partial products.",
      route: "Intramuscular at an age-appropriate site. PPSV23 has different route options and is covered on its own card.",
      contraindications: "Severe allergic reaction after a prior PCV, a diphtheria-toxoid-containing vaccine when relevant to the carrier, or a component.",
      precautions: "Moderate or severe acute illness. Pregnancy currently has no routine PCV recommendation because data are limited. Before administration, reconstruct every pneumococcal dose and date; duplicate or incorrectly spaced products add reaction risk without predictable benefit.",
      adverseEffects: "Injection-site pain, redness, swelling, fatigue, headache, muscle pain, or fever may occur. Local reactions can be more noticeable with repeat antigen exposure; severe allergy is rare.",
      pregnancy: "No routine PCV recommendation during pregnancy under the cited schedule; use current risk-benefit guidance for unusual high-risk circumstances.",
      immunocompromise: "Immunocompromise increases invasive-disease risk and may shorten the minimum PCV15-to-PPSV23 interval to 8 weeks. Response can be reduced, but these are nonlive products. HSCT, asplenia, renal disease, and immune therapies require history-specific planning.",
      nursingFocus: "Use an immunization information system and ask explicitly about Prevnar, Vaxneuvance, Capvaxive, and Pneumovax. Identify smoking, cochlear implant, CSF leak, spleen status, renal disease, diabetes, malignancy, HIV, transplant, and immunosuppressive therapy. Schedule the next PPSV23 date when PCV15 is chosen.",
      urgentEscalation: "Treat anaphylaxis immediately. Fever and meningitis or sepsis symptoms still require urgent evaluation after vaccination; partial serotype protection does not make invasive disease impossible.",
      pitfalls: "More valencies do not automatically mean repeat every product. Do not confuse PCV with PPSV23, do not give PPSV23 automatically after PCV20/21, do not ignore prior PCV13, and do not call this a vaccine against all pneumonia.",
      related: ["Pneumococcal polysaccharide vaccine", "Haemophilus influenzae type b vaccine", "Influenza vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-pneumococcal-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Inactivated poliovirus vaccine",
      aliases: ["polio vaccine", "IPV vaccine", "IPOL", "inactivated polio shot", "Salk vaccine", "polio booster"],
      abbreviations: ["IPV"],
      brands: ["IPOL"],
      commonMisspellings: ["poliomylitis vaccine", "polio vacine", "inactive polio vaccine"],
      platform: "Killed whole poliovirus antigens from the three serotypes; nonreplicating injectable vaccine. U.S. routine vaccination uses IPV rather than oral live polio vaccine.",
      protectsAgainst: "Paralytic poliomyelitis and systemic poliovirus disease caused by the represented serotypes. IPV generates excellent blood antibody but less intestinal mucosal immunity than oral vaccine, so exposure control and public-health response still matter.",
      mechanism: "Inactivated virions cannot replicate but display capsid antigens that induce neutralizing serum antibodies and memory B cells. If wild virus later crosses the gut barrier, circulating antibody blocks viremia and access to anterior horn motor neurons, preventing paralysis. Because injection produces less gut IgA than oral live vaccine, a vaccinated person may have less protection against transient intestinal infection than against neurologic disease.",
      routineSchedule: "Children: 4 doses at 2 months, 4 months, 6-18 months, and 4-6 years. The final dose must be given on or after the fourth birthday and at least 6 months after the preceding dose, even if combination products created four earlier doses. Adults known or suspected to be unvaccinated or incompletely vaccinated complete a 3-dose primary series.",
      catchUpMinimums: "Minimum age is 6 weeks. Early intervals are at least 4 weeks; the final interval is 6 months and the child must be at least 4 years for the final dose. An adult primary series is generally dose 2 at 1-2 months and dose 3 at 6-12 months after dose 2, with accelerated minimums used only when needed. Never restart a delayed valid series.",
      riskBased: "A fully vaccinated adult at increased exposure risk, such as travel to a polio-risk area, certain laboratory work, or outbreak response, may receive one lifetime IPV booster. Public-health instructions override routine timing during an outbreak.",
      sharedDecisionMaking: "No universal shared-decision category applies. The lifetime adult booster is exposure-risk based, not a routine ten-year booster.",
      doseCountAndSpacing: "Four childhood doses, with a mandatory age-4 final dose rule. Adults without a complete primary series need 3 total valid doses; adults with a complete series and increased risk may receive one lifetime booster.",
      doseVolumeSafety: "IPV is available alone and within multiple combination vaccines. Verify which antigens each injection supplied, the labeled dose and route, patient age, and whether the age-4 final-dose rule is satisfied. Do not count oral bivalent vaccine from another country without verifying date, formulation, and CDC equivalence.",
      route: "Intramuscular or subcutaneous according to the product label. Combination products are generally intramuscular; use the route specified for the exact product.",
      contraindications: "Severe allergy after a prior dose or to a vaccine component. Product components may include trace antibiotics; review the current label for a documented severe allergy.",
      precautions: "Moderate or severe acute illness. Pregnancy is not a reason for routine IPV, but vaccination can be used when exposure risk warrants. Records from outside the United States require product/date interpretation, especially after the global switch in oral vaccine formulations.",
      adverseEffects: "Injection-site soreness is common; fever or systemic symptoms are less common. Serious allergy is rare.",
      pregnancy: "If immediate protection is needed because exposure risk is increased, IPV can be given during pregnancy; otherwise defer routine adult catch-up when clinically appropriate under current guidance.",
      immunocompromise: "IPV is nonlive and can be administered, although response may be reduced. Household contacts can receive IPV safely.",
      nursingFocus: "Reconstruct polio antigens hidden in combination vaccines, verify any oral vaccine history and country/date, enforce the age-4 final-dose rule, and identify travel or outbreak deadlines early enough to use routine intervals when possible.",
      urgentEscalation: "Treat anaphylaxis immediately. Suspected acute flaccid paralysis or possible poliovirus exposure is a public-health emergency regardless of vaccination history and requires immediate isolation/evaluation and health-department notification.",
      pitfalls: "Do not assume four injections before age 4 complete the series, do not schedule routine adult boosters every ten years, do not equate IPV with oral vaccine mucosal effects, and do not accept an undocumented foreign 'polio vaccine' without formulation review.",
      related: ["DTaP vaccine", "Haemophilus influenzae type b vaccine", "Hepatitis B vaccine"],
      sourceKeys: ["w38-cdc-child-age-current", "w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "COVID-19 vaccine",
      aliases: ["coronavirus vaccine", "COVID shot", "Comirnaty", "Spikevax", "mNexspike", "Nuvaxovid", "Pfizer COVID vaccine", "Moderna COVID vaccine", "Novavax COVID vaccine", "2025-2026 COVID vaccine"],
      abbreviations: ["COVID-19 vaccine", "1vCOV-mRNA", "1vCOV-aPS"],
      brands: ["Comirnaty", "Spikevax", "mNexspike", "Nuvaxovid"],
      commonMisspellings: ["covid vacine", "corona virus shot", "covid booster schedual"],
      platform: "Current products use mRNA encoding SARS-CoV-2 spike protein or recombinant spike protein with adjuvant; formulation and authorized age change by season.",
      protectsAgainst: "Severe COVID-19, hospitalization, and death, with benefit influenced by age, immune status, prior infection/vaccination, circulating variants, and time since vaccination. Vaccination does not guarantee absence of infection or transmission.",
      mechanism: "mRNA products deliver transient genetic instructions that host cells use to make spike antigen, while protein-subunit vaccine directly supplies spike protein with an adjuvant. Antigen-presenting cells activate helper and cytotoxic T cells and B cells, producing neutralizing antibody and immune memory. Updated antigen composition improves recognition of circulating variants; waning antibody and viral evolution explain why a prior series is not a timeless endpoint.",
      routineSchedule: "Use the current 2025-2026 CDC table and individual-based/shared clinical decision-making for age 6 months or older. Unvaccinated age 6-23 months receives 2 Moderna doses 4-8 weeks apart; age 2-4 years receives 1 Moderna dose; age 5-11 years receives 1 age-appropriate Moderna or Pfizer dose; age 12-64 generally receives 1 current product dose; age 65 or older receives 2 current doses 6 months apart, subject to product-specific minimums and prior history.",
      catchUpMinimums: "History and product control the interval. A previous mRNA dose in young children may require 3-8 or 4-8 weeks; most previously vaccinated age 5-64 use at least 8 weeks before the current seasonal dose, while mNexspike has a different recommended interval. Age 65 or older uses a 6-month preferred interval with product-specific minimums. Never extrapolate last season's table.",
      riskBased: "The risk-benefit is most favorable for people at increased risk of severe COVID-19, including older age, pregnancy, immune compromise, and specified medical conditions, and for people with increased exposure. A person can self-attest to risk factors under current CDC guidance.",
      sharedDecisionMaking: "Current CDC guidance uses individual-based decision-making for age 6 months or older. Discuss the person's severe-disease risk, prior vaccination and infection, time since the last event, product availability, pregnancy, immune status, and rare adverse-event history; do not mislabel that process as no recommendation.",
      doseCountAndSpacing: "2025-2026 counts range from 1 to 2 routine doses by age/history, with additional schedules for moderate/severe immunocompromise. Age 6-23 months may require two current Moderna doses 4-8 weeks apart; age 65 or older uses two seasonal doses 6 months apart. Recheck the live CDC table each season.",
      doseVolumeSafety: "There is no universal COVID-19 mL dose. In the 2025-2026 table, volume and antigen differ among age groups and among Spikevax, mNexspike, Comirnaty/Pfizer, and Nuvaxovid. Verify season, manufacturer, trade name, age formulation, vial/syringe presentation, volume, antigen amount, route, prior history, and current label for every dose.",
      route: "Intramuscular using the product- and age-appropriate site and needle.",
      contraindications: "Severe allergic reaction after a prior dose or to a component is a contraindication to the same vaccine type; alternate-product evaluation may be possible with allergy expertise.",
      precautions: "Diagnosed nonsevere immediate allergy to a component or prior dose, myocarditis/pericarditis within 3 weeks after a COVID dose, MIS-C/MIS-A history, and moderate/severe acute illness require current-guidance review. An extended initial interval can reduce rare myocarditis risk in some people.",
      adverseEffects: "Pain, fatigue, headache, myalgia, chills, fever, and lymph-node swelling are expected possibilities. Myocarditis/pericarditis is rare and varies by age, sex, product, and interval; anaphylaxis is rare.",
      pregnancy: "Pregnancy and lactation are not live-vaccine contraindications. Discuss current seasonal vaccination because pregnancy increases severe-COVID risk and maternal immunity can protect the pregnant patient and infant.",
      immunocompromise: "Moderate/severe immunocompromise uses a separate schedule and can include additional doses through shared decision-making. Verify the CDC immunocompromised table rather than adding doses by intuition.",
      nursingFocus: "Document every manufacturer, formulation, season, lot, site, and date; ask about prior infection, all prior manufacturers, immune therapy, pregnancy, myocarditis/pericarditis, MIS, and allergy. Teach expected symptoms and when chest pain, dyspnea, or palpitations need assessment.",
      urgentEscalation: "Treat anaphylaxis immediately. Urgently assess persistent chest pain, shortness of breath, palpitations, syncope, shock, severe neurologic symptoms, or suspected myocarditis/pericarditis. Report clinically significant events through VAERS.",
      pitfalls: "Do not hard-code last season forever, call every dose a booster, assume all mRNA volumes match, deny vaccination for lack of risk documentation, or confuse post-vaccine symptoms with proof of infection or immunity.",
      related: ["Influenza vaccine", "Respiratory syncytial virus vaccine"],
      sourceKeys: ["w38-cdc-covid-current", "w38-cdc-adult-appendix-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Influenza vaccine",
      aliases: ["flu vaccine", "flu shot", "influenza immunization", "FluMist", "Fluzone", "Fluzone High-Dose", "Flublok", "Fluad", "Flucelvax", "Fluarix", "FluLaval", "Afluria"],
      abbreviations: ["IIV3", "ccIIV3", "RIV3", "HD-IIV3", "aIIV3", "LAIV3"],
      brands: ["Afluria", "Fluad", "Fluarix", "Flublok", "Flucelvax", "FluLaval", "FluMist", "Fluzone", "Fluzone High-Dose"],
      commonMisspellings: ["influenze vaccine", "flue shot", "influenza vacine"],
      platform: "Seasonal trivalent products include inactivated egg-based or cell-culture vaccine, recombinant hemagglutinin vaccine, adjuvanted/high-dose inactivated vaccine, and live attenuated intranasal vaccine.",
      protectsAgainst: "Seasonal influenza illness and, most importantly, severe disease, hospitalization, and complications. Match varies by season, but partial immune recognition can still reduce severity.",
      mechanism: "Most products present hemagglutinin antigen so B cells produce antibodies that block viral attachment to respiratory epithelial cells; T-cell responses support clearance and memory. LAIV briefly replicates in cooler nasal tissue and adds mucosal immunity. Antigenic drift and declining antibody require a reformulated dose each season, while higher-antigen or adjuvanted products can improve responses in older adults.",
      routineSchedule: "Every person age 6 months or older without a contraindication receives an age- and health-appropriate vaccine each season. Age 6 months-8 years needs 2 doses at least 4 weeks apart when fewer than 2 prior influenza doses before the season's cutoff are documented or history is unknown; otherwise one dose. Age 9 or older receives one seasonal dose. Age 65 or older preferably receives HD-IIV3, RIV3, or aIIV3 when available.",
      catchUpMinimums: "Influenza is seasonal rather than a lifetime series. When a child needs 2 doses, separate by at least 4 weeks even if the child turns 9 between them. Vaccinate later in the season if missed; do not give two doses to every child automatically.",
      riskBased: "Everyone age 6 months or older is routine, but product choice changes with pregnancy, immune status, age, transplant, asthma, medication, and contact with a severely immunosuppressed person in a protected environment.",
      sharedDecisionMaking: "Product selection can involve preference and availability, but annual vaccination itself is routine. If a preferred age-65 product is unavailable, use another age-appropriate vaccine instead of delaying indefinitely.",
      doseCountAndSpacing: "One dose each season for most; two doses at least 4 weeks apart for some age 6 months-8 years. A new season's dose is not a restart of a failed series; it updates and restores protection.",
      doseVolumeSafety: "Influenza volume is product-, presentation-, route-, and age-specific. Some injectable products use 0.5 mL from age 6 months, Fluzone High-Dose uses its labeled larger volume, and LAIV is intranasal rather than an IM volume. Verify the current season, exact brand, age approval, syringe/vial, labeled volume, route, and package instructions; never display one universal flu-shot volume.",
      route: "IIV, ccIIV, RIV, high-dose, and adjuvanted products are intramuscular; LAIV is intranasal. Use only the route labeled for the exact product.",
      contraindications: "Severe allergic reaction to a relevant prior influenza vaccine or component requires product-specific review. LAIV is contraindicated in pregnancy, immune compromise, certain young children with wheezing/asthma, aspirin/salicylate therapy in children/adolescents, and several other clinical settings.",
      precautions: "Guillain-Barre syndrome within 6 weeks after a prior influenza vaccine and moderate/severe acute illness require risk-benefit review. Egg allergy alone is not a blanket reason to withhold an age-appropriate influenza vaccine.",
      adverseEffects: "Injection-site soreness, fever, fatigue, headache, or myalgia may occur; LAIV can cause nasal symptoms. Syncope and rare severe allergy are possible. GBS is rare and the association must be interpreted against infection risk.",
      pregnancy: "Use an age-appropriate inactivated or recombinant influenza vaccine during any trimester in season. Do not use LAIV during pregnancy.",
      immunocompromise: "Use nonlive vaccine. LAIV is contraindicated in immunocompromise and for close contacts of a severely immunosuppressed person who requires a protected environment.",
      nursingFocus: "Determine age on vaccination day, prior-season dose history for children, pregnancy, immune status, transplant status, asthma/wheezing, GBS timing, and exact product. Document season and formulation, and teach that influenza vaccine cannot cause influenza from inactivated or recombinant product.",
      urgentEscalation: "Treat anaphylaxis immediately. Escalate new progressive weakness, respiratory compromise, severe neurologic symptoms, or another serious event and report through VAERS.",
      pitfalls: "Do not treat egg allergy as an automatic contraindication, do not give LAIV by injection, do not use LAIV in pregnancy or severe immunosuppression, and do not omit a valid nonpreferred product for an older adult when preferred products are unavailable.",
      related: ["COVID-19 vaccine", "Respiratory syncytial virus vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-adult-appendix-current", "w38-cdc-influenza-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "MMR vaccine",
      aliases: ["measles mumps rubella vaccine", "measles vaccine", "mumps vaccine", "rubella vaccine", "M-M-R II", "Priorix", "German measles vaccine"],
      abbreviations: ["MMR"],
      brands: ["M-M-R II", "Priorix"],
      commonMisspellings: ["MMR vacine", "measels mumps rubella", "measles mump rubella shot"],
      platform: "Live attenuated measles, mumps, and rubella viruses in one vaccine.",
      protectsAgainst: "Measles and its pneumonia/encephalitis complications, mumps and complications such as orchitis or meningitis, and rubella including congenital rubella syndrome when infection occurs during pregnancy.",
      mechanism: "Attenuated viruses undergo limited replication and present antigens through pathways resembling natural infection without causing ordinary disease in an immunocompetent recipient. This produces neutralizing antibodies, T-cell responses, and durable memory. The live replication that creates strong immunity also explains pregnancy and severe-immunocompromise restrictions and why antibody-containing blood products can blunt the response.",
      routineSchedule: "Children receive dose 1 at 12-15 months and dose 2 at 4-6 years. Adults without evidence of immunity generally need 1 dose; students in postsecondary education, international travelers, household contacts of immunocompromised people, and many healthcare personnel need 2 documented doses at least 4 weeks apart. Outbreak/travel guidance can add earlier or additional dosing.",
      catchUpMinimums: "Minimum routine age is 12 months and minimum interval between MMR doses is 4 weeks. A travel dose at age 6-11 months does not count toward the routine two-dose series after the first birthday. If MMRV is used in children, its product interval and age limits apply.",
      riskBased: "International travel, healthcare work, college attendance, outbreak exposure, and absence of immunity change dose count. A third mumps-containing dose can be recommended by public health during a defined outbreak.",
      sharedDecisionMaking: "No general shared-decision category applies. Evidence of immunity and risk setting determine vaccination; outbreak health-department guidance can supersede routine timing.",
      doseCountAndSpacing: "Routine childhood 2 doses. Adults need 1 or 2 doses by risk and evidence of immunity. Separate MMR doses by at least 4 weeks; same-day live-vaccine administration or appropriate spacing with other live vaccines matters.",
      doseVolumeSafety: "MMR brands and presentations require product-specific reconstitution and labeled route/volume. Verify brand, correct diluent, full reconstituted labeled dose, age, live-vaccine timing, expiration after reconstitution, and package instructions; never infer volume from the MMR abbreviation.",
      route: "Subcutaneous or intramuscular depending on the selected product label. Use immediately within labeled post-reconstitution limits.",
      contraindications: "Severe allergy after a prior dose/component, pregnancy, and severe immunodeficiency are major contraindications. Immunosuppressive therapy, certain congenital immune disorders, and hematologic malignancy require current guidance.",
      precautions: "Recent antibody-containing blood products, thrombocytopenia/history of thrombocytopenic purpura, moderate/severe acute illness, and certain HIV states require timing or risk review. MMR can be given the same day as another live vaccine; if not, live parenteral/intranasal vaccines generally need 28-day spacing.",
      adverseEffects: "Fever, mild rash, transient joint symptoms, or lymph-node swelling can occur. Febrile seizure and transient thrombocytopenia are uncommon; anaphylaxis is rare. The vaccine does not cause autism.",
      pregnancy: "Contraindicated during pregnancy. Vaccinate a nonimmune patient postpartum, ideally before discharge, and counsel to avoid pregnancy for 4 weeks after vaccination. Inadvertent administration is not by itself an indication to terminate pregnancy.",
      immunocompromise: "Severe immunocompromise is a contraindication; selected people with HIV and adequate immune function may be eligible under specific criteria. Check current immune status rather than using the word 'immunocompromised' without degree.",
      nursingFocus: "Verify two-dose dates/evidence of immunity, pregnancy, immune therapy, blood products, outbreak/travel status, and need for TB testing timing. Reconstitute only with the supplied diluent, protect from light as directed, and document the live-vaccine date for future spacing.",
      urgentEscalation: "Treat anaphylaxis immediately. Escalate encephalopathy, severe thrombocytopenic bleeding, persistent high fever with seizure, or serious systemic illness and report qualifying events through VAERS.",
      pitfalls: "Do not count a pre-birthday travel dose in the routine series, do not give during pregnancy or severe immunodeficiency, do not confuse MMR with MMRV, and do not repeat disproven autism claims.",
      related: ["Varicella vaccine", "MMRV combination vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-contraindications", "w38-cdc-vaccine-names"]
    },
    {
      name: "Varicella vaccine",
      aliases: ["chickenpox vaccine", "VAR vaccine", "Varivax", "chicken pox shot", "primary varicella vaccine"],
      abbreviations: ["VAR"],
      brands: ["Varivax"],
      commonMisspellings: ["varicela vaccine", "chicken pox vacine", "varicella zoster vaccine for kids"],
      platform: "Live attenuated varicella-zoster virus vaccine that prevents primary varicella; it is not recombinant zoster vaccine.",
      protectsAgainst: "Chickenpox and its bacterial skin infection, pneumonia, encephalitis, hospitalization, and congenital/perinatal risks. It does not serve as Shingrix and is not the adult recombinant product used to prevent shingles.",
      mechanism: "Attenuated VZV replicates to a limited degree, stimulating neutralizing antibody and virus-specific T cells. Those memory responses restrict wild-virus dissemination and reduce severity. Live replication explains pregnancy and severe-immunocompromise restrictions. RZV instead boosts immunity to latent virus with a recombinant antigen, so the two products cannot be substituted.",
      routineSchedule: "Children receive dose 1 at 12-15 months and dose 2 at 4-6 years. People without evidence of immunity need a 2-dose series: age 7-12 usually 3 months apart and age 13 or older 4-8 weeks apart. Adults with one prior dose receive the second at least 4 weeks later.",
      catchUpMinimums: "Minimum age is 12 months. When younger than 13, the recommended interval is 3 months, although a dose inadvertently at least 4 weeks later can be valid; age 13 or older uses a minimum 4 weeks. MMRV has a maximum licensed age of 12 years.",
      riskBased: "Healthcare personnel and household contacts of immunocompromised people without immunity need reliable two-dose protection. Postexposure vaccination can be useful when timely and not contraindicated.",
      sharedDecisionMaking: "No general shared-decision category applies. Evidence of immunity, pregnancy, immune status, and age determine use.",
      doseCountAndSpacing: "Two valid doses for people without evidence of immunity. Child routine spacing is years apart; catch-up spacing is age-dependent. Do not add Varivax merely because a patient needs Shingrix.",
      doseVolumeSafety: "Varivax and MMRV are different products and presentations. Verify canonical target VAR/Varivax, age, correct diluent, labeled reconstituted dose, route, live-vaccine spacing, and package instructions. Never use a Shingrix vial, dose, adjuvant, or IM assumption for varicella vaccination.",
      route: "Subcutaneous or intramuscular according to the current product label; MMRV is a separate subcutaneous combination product.",
      contraindications: "Severe allergy after a prior dose/component, pregnancy, and severe immunocompromise. Review neomycin/gelatin or other component allergy using the current label.",
      precautions: "Recent antibody-containing products, moderate/severe illness, certain antiviral drugs, and receipt of another live vaccine on a different day require timing review. Avoid salicylates for 6 weeks after vaccination when feasible under product guidance.",
      adverseEffects: "Injection-site symptoms, fever, or a limited varicella-like rash may occur. Transmission of vaccine virus is rare and mainly a concern when a rash develops; severe allergy is rare.",
      pregnancy: "Contraindicated during pregnancy. Vaccinate postpartum when indicated and avoid pregnancy for 4 weeks after a dose. A pregnant household contact is not a contraindication to vaccinating an eligible child.",
      immunocompromise: "Severe immune compromise is a contraindication. Selected people with HIV and adequate CD4 measures may be considered using specific guidance. If a vaccine-related rash develops, avoid direct contact with susceptible severely immunocompromised people until it resolves.",
      nursingFocus: "Ask specifically about chickenpox disease, two documented VAR/MMRV doses, shingles, pregnancy, immune therapy, blood products, antivirals, and live vaccines. Document VAR rather than the unsafe phrase 'varicella zoster shot.'",
      urgentEscalation: "Treat anaphylaxis immediately. Escalate disseminated vesicular rash, respiratory or neurologic illness, severe infection, or exposure of a high-risk susceptible contact; report qualifying events through VAERS.",
      pitfalls: "VAR is not RZV/Shingrix. Do not treat birth before 1980 as evidence of immunity for every pregnant patient or healthcare worker, do not ignore live-vaccine spacing, and do not use a pediatric mnemonic label 'varicella zoster.'",
      related: ["Recombinant zoster vaccine", "MMR vaccine", "MMRV combination vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-contraindications", "w38-cdc-vaccine-names"]
    },
    {
      name: "Hepatitis A vaccine",
      aliases: ["HepA vaccine", "hepatitis A shot", "hep A shot", "Havrix", "Vaqta", "HAV vaccine"],
      abbreviations: ["HepA", "HAV vaccine"],
      brands: ["Havrix", "Vaqta"],
      commonMisspellings: ["hepititis A vaccine", "hepatitus A shot", "hep a vacine"],
      platform: "Inactivated whole hepatitis A virus vaccine; Twinrix combines pediatric-dose HepA antigen with adult HepB antigen in a distinct adult product.",
      protectsAgainst: "Hepatitis A infection, jaundice, prolonged illness, outbreak transmission, fulminant hepatitis, and decompensation risk in people with chronic liver disease.",
      mechanism: "Inactivated virions cannot replicate but present capsid antigens to helper T cells and B cells, producing neutralizing anti-HAV antibody and memory. Antibody blocks virus before widespread hepatocyte infection. Chronic liver disease does not make infection more likely by itself but can make the consequences more dangerous, explaining the risk-based priority.",
      routineSchedule: "Children start a 2-dose series at age 12-23 months with at least 6 months between doses. Any adult who requests protection can complete HepA vaccination without proving a risk. Adults use Havrix 6-12 months apart or Vaqta 6-18 months apart; Twinrix follows its own 3- or 4-dose schedule.",
      catchUpMinimums: "For single-antigen HepA, the minimum interval is 6 months. A dose given too early may need repeating. Do not restart a late series. Twinrix minimum intervals and its accelerated schedule are different and must be followed as a combination product.",
      riskBased: "Indications include chronic liver disease, HIV, travel, homelessness, drug use, men who have sex with men, occupational exposure to HAV, outbreak response, and close contact with an international adoptee from a higher-endemicity country. Postexposure prophylaxis can require vaccine and/or immune globulin based on age and risk.",
      sharedDecisionMaking: "Any person requesting vaccination may receive it; risk disclosure is not required. Postexposure immune globulin decisions are clinical and time-sensitive rather than routine shared decision-making.",
      doseCountAndSpacing: "Two single-antigen doses at least 6 months apart. Twinrix uses 0, 1, 6 months or an accelerated 0, 7, 21-30 day sequence plus a 12-month booster.",
      doseVolumeSafety: "Pediatric and adult Havrix/Vaqta formulations have different antigen content and labeled volumes; Twinrix is a separate combination dose. Verify brand, age formulation, antigen content, volume, IM route, and series before administration. Do not halve an adult syringe or double a pediatric dose unofficially.",
      route: "Intramuscular at an age-appropriate site.",
      contraindications: "Severe allergic reaction after a prior dose or to a component.",
      precautions: "Moderate or severe acute illness. For postexposure care, age, immune status, chronic liver disease, pregnancy, and time since exposure affect whether immune globulin is also indicated.",
      adverseEffects: "Injection-site soreness, headache, fatigue, appetite change, or fever can occur. Severe allergy is rare.",
      pregnancy: "Inactivated HepA can be given during pregnancy when indicated by exposure or risk; balance the benefit of preventing maternal disease against available safety data.",
      immunocompromise: "The vaccine is nonlive, but response may be lower. HIV or other immune compromise can strengthen the indication and may affect postexposure strategy.",
      nursingFocus: "Ask about travel timing, liver disease, HIV, homelessness, drug use, occupational or outbreak exposure, and prior brands. For a recent exposure, escalate promptly because prophylaxis is time-sensitive. Schedule dose 2 before the patient leaves.",
      urgentEscalation: "Treat anaphylaxis immediately. Escalate suspected acute hepatitis, jaundice, coagulopathy, altered mental status, or a high-risk recent exposure for evaluation and public-health action.",
      pitfalls: "Do not confuse HepA and HepB, do not apply Twinrix intervals to Havrix/Vaqta, do not require risk disclosure from a requesting adult, and do not delay postexposure assessment until routine follow-up.",
      related: ["Hepatitis B vaccine", "Hepatitis A-Hepatitis B combination vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Tdap vaccine",
      aliases: ["tetanus diphtheria pertussis booster", "whooping cough booster", "Boostrix", "Adacel", "pregnancy pertussis vaccine", "adolescent tetanus shot"],
      abbreviations: ["Tdap"],
      brands: ["Boostrix", "Adacel"],
      commonMisspellings: ["TDAP vacine", "TDaP shot", "tetanus diptheria pertusis booster"],
      platform: "Nonlive reduced-diphtheria-toxoid and acellular-pertussis booster with tetanus toxoid, formulated for older children and adults.",
      protectsAgainst: "Tetanus, diphtheria, and pertussis, with special importance for preventing severe pertussis in newborns through maternal antibody.",
      mechanism: "Tetanus and diphtheria toxoids induce neutralizing antibodies against circulating toxins, while acellular pertussis proteins restore antibody and T-cell recognition of key virulence factors. Antibody wanes, so a later booster restores protection. During pregnancy, maternal IgG crosses the placenta and protects the newborn before the infant DTaP series can become effective.",
      routineSchedule: "Give one Tdap at age 11-12 years. Anyone age 7 or older with incomplete DTaP/tetanus series receives Tdap as the preferred first catch-up dose. Adults who never received Tdap receive one, then Td vaccine or Tdap every 10 years. Give Tdap during every pregnancy, preferably early in gestational weeks 27-36, regardless of interval since the last tetanus-containing vaccine.",
      catchUpMinimums: "For an incomplete adult primary series: Tdap now, Td vaccine or Tdap at least 4 weeks later, and a final Td vaccine or Tdap 6-12 months later, then ten-year boosters. Age-7-18 transition rules depend on age at prior DTaP doses. Wound management may require a dose at 5 or 10 years depending on wound type and history.",
      riskBased: "Each pregnancy is a new indication because infant antibody is the goal. Wound management, healthcare work, close infant contact, and outbreak circumstances can make timing relevant, but no extra routine Tdap is added for every exposure.",
      sharedDecisionMaking: "After the required one lifetime adolescent/adult Tdap and pregnancy doses, either Td vaccine or Tdap may serve as a ten-year or wound-management booster under current guidance.",
      doseCountAndSpacing: "One adolescent dose, at least one adult Tdap if never received, one during every pregnancy, and Tdap as part of a three-dose primary catch-up when needed. Later boosters may be Td or Tdap.",
      doseVolumeSafety: "Tdap products use a labeled 0.5-mL IM dose, but brand age indications, presentation, and prior antigen history still matter. Verify Tdap rather than DTaP or Td, exact brand, age, pregnancy status, route, labeled volume, and lot; similar abbreviations are not interchangeable products.",
      route: "Intramuscular, usually deltoid in adolescents/adults.",
      contraindications: "Severe allergy after a prior dose/component, or encephalopathy not attributable to another cause within 7 days after a previous pertussis-containing vaccine.",
      precautions: "GBS within 6 weeks after tetanus-toxoid vaccine, Arthus reaction with at least a 10-year deferral, progressive/unstable neurologic disease, or moderate/severe acute illness. Stable neurologic disease and breastfeeding are not automatic contraindications.",
      adverseEffects: "Pain, redness, swelling, fatigue, headache, myalgia, GI symptoms, or fever can occur. Extensive local swelling and syncope are possible; severe allergy is rare.",
      pregnancy: "Give during every pregnancy at 27-36 weeks, preferably early in that window. If indicated earlier for wound care or outbreak, follow current guidance about whether another pregnancy-window dose is needed.",
      immunocompromise: "Tdap is nonlive and can be administered, although response may be reduced. Do not omit maternal Tdap solely because of household immune compromise.",
      nursingFocus: "Differentiate DTaP, Tdap, and Td on the order, vial, and record. Assess pregnancy gestational age, prior encephalopathy, GBS/Arthus timing, primary-series completion, and wound type. Schedule remaining catch-up doses and teach cocooning does not replace maternal Tdap.",
      urgentEscalation: "Treat anaphylaxis immediately. Escalate encephalopathy, prolonged seizure, respiratory compromise, shock, or progressive neurologic symptoms and report qualifying events through VAERS.",
      pitfalls: "Do not substitute pediatric DTaP, do not omit Tdap because a recent Td was given, do not treat a ten-year booster as the pregnancy rule, and do not confuse wound intervals with routine ten-year timing.",
      related: ["Td vaccine", "DTaP vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-contraindications", "w38-cdc-vaccine-names"]
    },
    {
      name: "Td vaccine",
      aliases: ["tetanus diphtheria vaccine", "tetanus booster", "Tenivac", "TdVax", "adult tetanus shot", "tetanus and diphtheria toxoids"],
      abbreviations: ["Td"],
      brands: ["Tenivac", "TdVax"],
      commonMisspellings: ["TD vacine", "tetanis booster", "tetanus diptheria shot"],
      platform: "Nonlive tetanus and reduced-dose diphtheria toxoids without pertussis antigen.",
      protectsAgainst: "Tetanus toxin disease and diphtheria toxin disease. It does not protect against pertussis, which is why at least one Tdap and Tdap during every pregnancy remain distinct requirements.",
      mechanism: "Toxoids cannot cause toxin-mediated disease but retain antigenic structure, stimulating antibodies that bind active tetanus and diphtheria toxins before they enter neurons or damage tissue. Circulating antibody declines over years, so boosters maintain a protective buffer. Because Td contains no pertussis antigen, it cannot restore pertussis immunity.",
      routineSchedule: "After a complete primary series and at least one Tdap, use Td vaccine or Tdap every 10 years. For an incomplete adult primary series, Td may supply dose 2 at least 4 weeks after Tdap and the final dose 6-12 months later. Wound management may require Td or Tdap when more than 10 years have elapsed for a clean minor wound or more than 5 years for other wounds.",
      catchUpMinimums: "A three-dose primary catch-up uses dose 1 Tdap, dose 2 Td/Tdap at least 4 weeks later, and dose 3 Td/Tdap 6-12 months later. An interrupted series is continued, not restarted. Wound prophylaxis also depends on whether fewer than 3 valid tetanus doses were received and whether tetanus immune globulin is indicated.",
      riskBased: "Dirty/major wounds, burns, punctures, crush injuries, frostbite, saliva-contaminated wounds, and necrotic tissue change the booster interval and may create a TIG indication when primary immunity is incomplete or immune status is severe.",
      sharedDecisionMaking: "For a routine ten-year or wound booster after prior Tdap, either Td or Tdap can be used. Td cannot replace the Tdap requirement during each pregnancy.",
      doseCountAndSpacing: "A 0.5-mL labeled IM dose is one antigen event, but total dose count comes from primary-series and booster history. Use at 10-year intervals after series completion or shorter wound intervals when indicated.",
      doseVolumeSafety: "Verify the vial says Td, not Tdap or DTaP, and confirm the labeled 0.5-mL IM dose, age indication, lot, and route. Dose volume does not tell which antigens are present; a 0.5-mL DTaP/Tdap/Td error is still a wrong-product error.",
      route: "Intramuscular, generally deltoid in an adult.",
      contraindications: "Severe allergic reaction after a prior tetanus/diphtheria-toxoid dose or component.",
      precautions: "GBS within 6 weeks after a tetanus-toxoid dose, Arthus-type reaction with deferral until at least 10 years after the last tetanus/diphtheria toxoid, or moderate/severe acute illness.",
      adverseEffects: "Local soreness, redness, swelling, fatigue, headache, or fever can occur. Large local/Arthus reactions are uncommon; severe allergy is rare.",
      pregnancy: "If tetanus-containing vaccine is indicated during pregnancy, use Tdap rather than Td so pertussis antibody is also provided to the infant.",
      immunocompromise: "Td is nonlive. Severe immune compromise may influence TIG use after a tetanus-prone wound even when some vaccination is documented; follow current wound guidance.",
      nursingFocus: "Classify the wound, count valid tetanus doses, identify date and type of the last product, determine whether Tdap was ever received, and assess TIG need. Document wound characteristics and the antigen product, not merely 'tetanus shot.'",
      urgentEscalation: "Treat anaphylaxis immediately. A tetanus-prone wound with incomplete/unknown series, immunodeficiency, devitalized tissue, or clinical muscle rigidity/spasm needs urgent evaluation and possibly TIG, wound care, antibiotics, and treatment.",
      pitfalls: "Td is not Tdap and provides no pertussis protection. Do not use the ten-year rule for every wound, do not restart a late series, do not omit TIG assessment, and do not give Td instead of pregnancy Tdap.",
      related: ["Tdap vaccine", "DTaP vaccine"],
      sourceKeys: ["w38-cdc-child-catchup-current", "w38-cdc-adult-notes-current", "w38-cdc-contraindications", "w38-cdc-vaccine-names"]
    },
    {
      name: "Human papillomavirus vaccine",
      aliases: ["HPV vaccine", "Gardasil 9", "Gardasil9", "9-valent HPV vaccine", "cervical cancer vaccine"],
      abbreviations: ["HPV", "9vHPV"],
      brands: ["Gardasil 9"],
      commonMisspellings: ["human papiloma virus vaccine", "HPV vacine", "gardisil"],
      platform: "Recombinant L1 virus-like particles from nine HPV types; nonlive and noninfectious.",
      protectsAgainst: "New infection with HPV types responsible for most cervical and many anal, penile, vulvar, vaginal, and oropharyngeal cancers plus most genital warts. It prevents new infection; it does not treat established HPV, dysplasia, or cancer.",
      mechanism: "Self-assembled L1 particles resemble the viral shell but contain no viral genome. They generate high neutralizing antibody concentrations at mucosal surfaces, blocking virions before basal epithelial cells are infected. Vaccination before exposure yields the greatest benefit, explaining routine preadolescent timing even though cancer occurs years later.",
      routineSchedule: "Routine at age 11-12 and may start at age 9. Start age 9-14: 2 doses at 0 and 6-12 months. Start age 15 or older: 3 doses at 0, 1-2, and 6 months. Catch-up is routine through age 26; age 27-45 uses shared clinical decision-making.",
      catchUpMinimums: "Two-dose schedule requires at least 5 months between doses; if closer, add a third. Three-dose minimums are 4 weeks from dose 1 to 2, 12 weeks from dose 2 to 3, and 5 months from dose 1 to 3. Do not restart a delayed series.",
      riskBased: "Immunocompromising conditions, including HIV, require 3 doses even when started at age 9-14. History of sexual assault can support starting at age 9. Prior HPV exposure or an abnormal screening result does not remove potential protection against types not acquired.",
      sharedDecisionMaking: "At age 27-45, discuss likelihood of future new exposure, prior vaccination, expected incremental benefit, and patient values. This is not routine vaccination for everyone in that age range and is not a therapeutic intervention for existing disease.",
      doseCountAndSpacing: "Two doses for an immunocompetent start before age 15 with valid spacing; three doses for start at age 15 or older or for immunocompromise.",
      doseVolumeSafety: "Gardasil 9 is supplied as a labeled 0.5-mL IM dose. Verify 9vHPV product, age at dose 1, immune status, series dates, IM route, and package label; a correct volume does not fix an incorrect two-versus-three-dose plan.",
      route: "Intramuscular, usually deltoid in adolescents/adults.",
      contraindications: "Severe allergy after a prior dose or to a component, including yeast hypersensitivity relevant to the product.",
      precautions: "Moderate/severe acute illness. Defer remaining doses during pregnancy. Observe seated or supine because post-injection syncope is common in adolescents.",
      adverseEffects: "Injection-site pain, swelling, headache, fever, dizziness, nausea, and syncope can occur; severe allergy is rare.",
      pregnancy: "Not recommended during pregnancy; delay remaining doses until afterward. Pregnancy testing is not required and inadvertent vaccination is not an indication for intervention.",
      immunocompromise: "Use a 3-dose schedule. Response may be lower, but the vaccine is nonlive and remains indicated.",
      nursingFocus: "Record age at the first dose because it controls series length, assess immune status and pregnancy, schedule the next dose, prevent syncope-related falls, and reinforce continued cancer screening because vaccination does not cover every oncogenic type.",
      urgentEscalation: "Treat anaphylaxis immediately. Evaluate significant injury after syncope or other severe symptoms and report qualifying events through VAERS.",
      pitfalls: "Do not wait for sexual activity, do not call it treatment for HPV, do not give only two doses to an immunocompromised patient, and do not stop cervical screening after vaccination.",
      related: ["Hepatitis B vaccine", "Tdap vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Meningococcal ACWY vaccine",
      aliases: ["MenACWY vaccine", "quadrivalent meningococcal vaccine", "Menveo", "MenQuadfi", "college meningitis vaccine", "MCV4"],
      abbreviations: ["MenACWY", "MCV4", "MenACWY-CRM", "MenACWY-TT"],
      brands: ["Menveo", "MenQuadfi"],
      commonMisspellings: ["meningococal ACWY vaccine", "meningitis vacine", "menveo shot"],
      platform: "Capsular polysaccharides from meningococcal serogroups A, C, W, and Y conjugated to a carrier protein.",
      protectsAgainst: "Invasive meningococcal disease caused by serogroups A, C, W, and Y, including rapidly progressive meningitis and meningococcemia. It does not protect against serogroup B.",
      mechanism: "Protein conjugation turns capsule antigen into a T-cell-dependent response with high-affinity antibody and immune memory. Antibody activates complement and opsonization against encapsulated Neisseria meningitidis. Complement deficiency or inhibition creates very high disease risk even after vaccination, explaining continued boosters and urgent evaluation of symptoms.",
      routineSchedule: "Routine adolescents receive dose 1 at 11-12 years and booster at 16. Catch-up age 13-15 receives a dose now and booster at 16-18 at least 8 weeks later; age 16-18 needs one dose if not previously given.",
      catchUpMinimums: "Minimum interval between a needed primary/catch-up pair is generally 8 weeks. Risk-based infant series and booster intervals are product-, age-, and condition-specific. Use current notes for Menveo versus MenQuadfi.",
      riskBased: "Asplenia/sickle cell disease, HIV, persistent complement deficiency, complement-inhibitor therapy, microbiology exposure, outbreak, travel to hyperendemic/epidemic areas, military recruitment, and first-year college residential housing can create primary and booster indications. Ongoing high risk often requires boosters every 5 years.",
      sharedDecisionMaking: "Routine adolescent MenACWY is not shared decision-making. The college/military and clinical-risk pathways depend on prior age-16 vaccination and current exposure.",
      doseCountAndSpacing: "Routine adolescence uses 2 doses separated by roughly 4-5 years. High-risk primary series often uses 2 doses at least 8 weeks apart with repeat boosters while risk remains.",
      doseVolumeSafety: "MenACWY products and combination MenABCWY products differ in components, reconstitution, age approval, and schedules even when the labeled IM volume is 0.5 mL. Verify canonical MenACWY target, brand, age, risk, route, volume, and whether MenB is separately due.",
      route: "Intramuscular using an age-appropriate site.",
      contraindications: "Severe allergy after a prior dose or to a component, including a relevant carrier-protein allergy.",
      precautions: "Moderate/severe acute illness. Product age limits and reconstitution must be checked; simultaneous MenB is given at a different site when feasible.",
      adverseEffects: "Injection-site pain, headache, fatigue, or fever can occur. Syncope and rare severe allergy are possible.",
      pregnancy: "Pregnancy does not preclude MenACWY when a risk indication exists; use current risk-benefit guidance.",
      immunocompromise: "Asplenia, HIV, complement deficiency, and complement-inhibitor therapy create indications and booster needs. Vaccination does not eliminate breakthrough risk during complement inhibition.",
      nursingFocus: "Ask about spleen function, sickle cell disease, HIV, eculizumab/ravulizumab or other complement inhibitors, travel, dormitory, military, lab work, and outbreak. Record serogroup product precisely and schedule boosters.",
      urgentEscalation: "Fever, petechiae/purpura, neck stiffness, severe headache, hypotension, or rapid deterioration is an emergency despite vaccination. Start sepsis/meningitis pathways and notify public health as required.",
      pitfalls: "MenACWY is not MenB. Do not treat 'meningitis shot' as one product, do not omit boosters in persistent high risk, and do not reassure a complement-inhibited patient with fever solely because vaccinated.",
      related: ["Meningococcal B vaccine", "Meningococcal ABCWY combination vaccine", "Haemophilus influenzae type b vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Meningococcal B vaccine",
      aliases: ["MenB vaccine", "serogroup B meningococcal vaccine", "Bexsero", "Trumenba", "meningitis B shot"],
      abbreviations: ["MenB", "MenB-4C", "MenB-FHbp"],
      brands: ["Bexsero", "Trumenba"],
      commonMisspellings: ["meningococal B vaccine", "men B vacine", "bexero"],
      platform: "Recombinant meningococcal surface-protein vaccine; Bexsero and Trumenba use different antigen systems and are not interchangeable.",
      protectsAgainst: "Invasive serogroup B meningococcal disease. It does not replace MenACWY protection against A, C, W, or Y.",
      mechanism: "Serogroup B capsule resembles human neural-cell carbohydrates, so the vaccine targets bacterial surface proteins instead of that capsule. Antibodies bind expressed proteins and promote complement-mediated killing. Strain antigen expression varies, and protection wanes, explaining brand-specific series and boosters for ongoing high risk.",
      routineSchedule: "Healthy age 16-23 may receive MenB through shared clinical decision-making, with age 16-18 preferred. Use the same brand for all doses: normally 2 doses at least 6 months apart; a rapid-protection 3-dose series at 0, 1-2, and 6 months may be used when needed.",
      catchUpMinimums: "If dose 2 of a planned two-dose series occurs before 6 months, add dose 3 at least 4 months later. High-risk primary series is 0, 1-2, and 6 months with product-specific validity rules. Do not switch Bexsero and Trumenba.",
      riskBased: "Asplenia/sickle cell disease, persistent complement deficiency, complement-inhibitor therapy, microbiologists exposed to N. meningitidis, and outbreak risk use a 3-dose primary series plus booster at 1 year and every 2-3 years while risk remains.",
      sharedDecisionMaking: "For healthy age 16-23, discuss low but serious disease risk, time to college or other exposure, durability, series completion, and preference. The decision is distinct from routine MenACWY.",
      doseCountAndSpacing: "Two doses 6 months apart for healthy shared-decision use; three doses at 0, 1-2, 6 months for rapid or high-risk protection, followed by risk-based boosters.",
      doseVolumeSafety: "Bexsero and Trumenba each use a labeled 0.5-mL IM dose but are different antigen products and cannot complete each other's series. Verify brand, MenB target, age, indication, volume, route, and all prior MenB or MenABCWY products.",
      route: "Intramuscular, at a separate site from MenACWY when coadministered if feasible.",
      contraindications: "Severe allergy after a prior same-product dose or to a component.",
      precautions: "Moderate/severe acute illness. Delay during pregnancy unless high-risk benefit outweighs uncertainty. Brand history must be known or reconstructed.",
      adverseEffects: "Injection-site pain, fatigue, headache, myalgia, fever, nausea, and syncope can occur; severe allergy is rare.",
      pregnancy: "Generally delay until after pregnancy when risk is not high; may use if increased disease risk outweighs limited safety data.",
      immunocompromise: "Asplenia and complement pathway impairment are central high-risk indications. Response may be imperfect and antibiotic/public-health strategies can still be required.",
      nursingFocus: "Document brand at every dose, identify spleen/complement status and complement inhibitors, determine college timing, schedule the full series, and teach that MenB does not complete MenACWY.",
      urgentEscalation: "Treat anaphylaxis immediately. Suspected meningococcemia or meningitis remains an emergency in a vaccinated patient.",
      pitfalls: "Do not interchange Bexsero and Trumenba, do not call healthy-adolescent MenB universal, do not use MenB as an ACWY booster, and do not omit ongoing-risk boosters.",
      related: ["Meningococcal ACWY vaccine", "Meningococcal ABCWY combination vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Meningococcal ABCWY combination vaccine",
      aliases: ["MenABCWY vaccine", "pentavalent meningococcal vaccine", "Penbraya", "Penmenvy", "combined meningitis vaccine"],
      abbreviations: ["MenABCWY", "MenACWY-TT/MenB-FHbp", "MenACWY-CRM/MenB-4C"],
      brands: ["Penbraya", "Penmenvy"],
      commonMisspellings: ["men ABCWY vacine", "pentavalent menengococcal vaccine", "penbraya shot"],
      platform: "One injection combines MenACWY conjugate antigens with a brand-specific recombinant MenB component.",
      protectsAgainst: "The ACWY serogroups plus serogroup B when both components are indicated on the same visit; it does not create an unofficial new schedule independent of its components.",
      mechanism: "The conjugate portion induces T-cell-dependent anticapsular antibody to A/C/W/Y, while recombinant surface proteins induce bactericidal antibody to B. Combining components reduces injections but does not erase the different booster logic, prior-product history, or MenB brand-series constraints.",
      routineSchedule: "Use age 10 or older when MenACWY and MenB are both due at the same visit and the selected product fits prior series. It is not a routine replacement for every adolescent MenACWY visit because healthy MenB remains shared decision-making.",
      catchUpMinimums: "Count each component against its own schedule. Penbraya contains the Trumenba MenB-FHbp component; Penmenvy contains the Bexsero MenB-4C component. Subsequent MenB doses must preserve the matching brand family and minimum intervals.",
      riskBased: "Useful when persistent ACWY and B risks overlap, such as asplenia or complement deficiency/inhibition, and both components are due. Booster use depends on time since the prior combination dose and whether both antigens are due that day.",
      sharedDecisionMaking: "For a healthy adolescent, MenB decision-making occurs before choosing a combination product. Do not let convenience silently convert an optional MenB decision into an unexamined universal dose.",
      doseCountAndSpacing: "A combination injection counts as one MenACWY component dose and one matching MenB component dose. The full series and boosters are determined separately for each component.",
      doseVolumeSafety: "Penbraya and Penmenvy are labeled IM combination doses with different MenB families. Verify exact brand, age, both component indications, reconstitution/presentation, labeled volume, route, and prior MenACWY/MenB products; never infer that one syringe completes both series.",
      route: "Intramuscular using the labeled product preparation.",
      contraindications: "Severe allergy to a prior component vaccine, carrier protein, or product component.",
      precautions: "Moderate/severe acute illness, pregnancy without high risk, and uncertain MenB brand history require review.",
      adverseEffects: "Local pain, fatigue, headache, muscle pain, fever, nausea, and syncope can occur; severe allergy is rare.",
      pregnancy: "Use only when disease risk and both component indications justify vaccination; otherwise defer MenB-containing vaccination.",
      immunocompromise: "Asplenia and complement impairment may create overlapping indications, but breakthrough risk persists and boosters remain component-specific.",
      nursingFocus: "Run two checks before one injection: is MenACWY due, and is the matching MenB component due? Record both component credits and the exact brand so later software does not misroute the series.",
      urgentEscalation: "Treat anaphylaxis immediately. Suspected invasive meningococcal disease remains an emergency regardless of combination vaccination.",
      pitfalls: "Do not route Penbraya/Penmenvy to generic MenACWY alone, do not mix their MenB families, and do not assume the combination is indicated whenever either one component is due.",
      related: ["Meningococcal ACWY vaccine", "Meningococcal B vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Dengue vaccine",
      aliases: ["Dengvaxia", "DEN4CYD", "CYD-TDV", "dengue fever vaccine", "tetravalent dengue vaccine"],
      abbreviations: ["DEN4CYD", "CYD-TDV"],
      brands: ["Dengvaxia"],
      commonMisspellings: ["dengue vacine", "dengay vaccine", "dengvaxea"],
      platform: "Live recombinant tetravalent chimeric vaccine representing dengue serotypes 1-4.",
      protectsAgainst: "Hospitalization and severe dengue in a narrowly eligible child who has laboratory-confirmed previous dengue infection and lives in an endemic U.S. area.",
      mechanism: "Live recombinant viruses stimulate immunity to all four dengue serotypes. In a previously infected person, vaccination acts like a controlled subsequent exposure and broadens protection. In a never-infected person, it can prime immunity in a way that makes a later natural infection behave immunologically like a riskier secondary infection, which explains the mandatory pre-vaccination laboratory evidence.",
      routineSchedule: "Only age 9-16, living in an endemic area, with laboratory confirmation of prior dengue infection: 3 doses at 0, 6, and 12 months. It is not routine for travelers, adults, or seronegative children. Sanofi has discontinued manufacturing Dengvaxia; CDC currently identifies U.S. access in Puerto Rico, so availability must be confirmed before starting or continuing the series.",
      catchUpMinimums: "Minimum interval is 6 months between doses. Eligibility must still be present; do not compress the series or substitute a clinical history for an approved laboratory test.",
      riskBased: "Geography plus confirmed prior infection are both required. Travel to an endemic country by itself is not the U.S. indication for Dengvaxia. Current access is limited and must be verified with the immunization program before committing a family to a three-dose series.",
      sharedDecisionMaking: "No broad shared-decision pathway exists outside the restricted indication. A preference for vaccination cannot override absent serologic evidence or nonendemic residence.",
      doseCountAndSpacing: "Three subcutaneous doses at 0, 6, and 12 months.",
      doseVolumeSafety: "Use the labeled Dengvaxia 0.5-mL subcutaneous dose only after verifying age 9-16, approved endemic residence, laboratory-confirmed prior dengue, product, diluent, route, and package instructions.",
      route: "Subcutaneous after correct reconstitution.",
      contraindications: "No laboratory evidence of prior dengue infection, severe allergy, pregnancy, or severe immunodeficiency.",
      precautions: "Moderate/severe acute illness and nonsevere HIV/immune concerns require review. Verify the exact approved pre-vaccination test pathway.",
      adverseEffects: "Injection-site pain, headache, malaise, myalgia, or fever can occur. The major preventable harm is vaccination of a dengue-naive recipient, which can increase later severe-dengue risk.",
      pregnancy: "Do not administer during pregnancy because it is live and not recommended.",
      immunocompromise: "Severe immunodeficiency is a contraindication; assess HIV and immune status under current guidance.",
      nursingFocus: "Require documented qualifying lab evidence and endemic residence, verify age and current product access, preserve the 0/6/12-month series, and teach families that vaccination does not replace mosquito avoidance or urgent assessment of warning signs.",
      urgentEscalation: "Treat anaphylaxis immediately. Abdominal pain, persistent vomiting, bleeding, lethargy, fluid accumulation, shock, or rapid deterioration during dengue illness needs emergency evaluation.",
      pitfalls: "Do not vaccinate a seronegative child, do not use for travel alone, do not infer prior infection from symptoms, do not shorten six-month intervals, and do not promise access without checking the current discontinuation/supply situation.",
      related: ["Yellow fever vaccine", "Chikungunya vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-contraindications", "w38-cdc-vaccine-names", "w38-cdc-dengue-vaccine"]
    },
    {
      name: "Mpox vaccine",
      aliases: ["Jynneos", "monkeypox vaccine", "MVA-BN vaccine", "mpox shot", "modified vaccinia Ankara vaccine"],
      abbreviations: ["MVA-BN"],
      brands: ["Jynneos"],
      commonMisspellings: ["monkey pox vaccine", "mpox vacine", "jynneous"],
      platform: "Live, nonreplicating modified vaccinia Ankara orthopoxvirus vaccine.",
      protectsAgainst: "Mpox and severe orthopoxvirus disease; used for people with defined exposure risk, postexposure prophylaxis, or outbreak-related indications rather than universal age-based vaccination.",
      mechanism: "Vaccinia antigens share conserved orthopoxvirus proteins with monkeypox virus. Antibody and T cells induced by the nonreplicating vector recognize those shared targets and restrict viral spread. The vector cannot productively replicate in human cells, distinguishing Jynneos from replicating ACAM2000 and changing its safety profile.",
      routineSchedule: "No universal routine series. Eligible risk-based recipients receive 2 doses 28 days apart. Postexposure vaccination is most effective when given promptly after exposure under public-health guidance.",
      catchUpMinimums: "The standard interval is 28 days; the minimum acceptable interval and grace-period rules should follow current outbreak guidance. A delayed second dose is given when possible, not restarted.",
      riskBased: "Eligibility can include sexual or intimate-contact risk networks, laboratory/occupational orthopox exposure, named contact, outbreak guidance, or another CDC-defined risk. Do not demand stigmatizing disclosure beyond what is needed to assess eligibility.",
      sharedDecisionMaking: "Discuss exposure likelihood, timing, immune status, skin disease, pregnancy, route options, and local public-health supply. Risk-based recommendation is not universal vaccination.",
      doseCountAndSpacing: "Two doses 28 days apart for primary vaccination; booster policy depends on ongoing occupational exposure and current guidance.",
      doseVolumeSafety: "Jynneos route changes dose volume: the standard subcutaneous presentation uses 0.5 mL, while authorized intradermal use has used 0.1 mL under specific guidance. Verify current authorization, age, route, needle/technique, volume, product, and package instructions; never choose volume without choosing route.",
      route: "Subcutaneous routinely; intradermal only when current guidance authorizes it and staff are trained. Do not use the percutaneous ACAM2000 technique.",
      contraindications: "Severe allergy to a prior dose or component requires expert risk assessment; in a high-risk exposure, alternatives and supervised administration may be considered.",
      precautions: "Moderate/severe acute illness. Review pregnancy, breastfeeding, immune status, keloid history for intradermal administration, and severe component allergy.",
      adverseEffects: "Local pain, redness, swelling, induration, itching, fatigue, headache, myalgia, nausea, and chills can occur; intradermal discoloration/induration may persist. Severe allergy is rare.",
      pregnancy: "Pregnancy is not an absolute barrier when a meaningful mpox exposure risk exists; discuss limited data and disease risk. Jynneos is nonreplicating.",
      immunocompromise: "Jynneos cannot productively replicate and is preferred over replicating vaccinia products, although immune response may be reduced.",
      nursingFocus: "Assess exposure timing without stigma, contact public health when indicated, record route and volume together, schedule dose 2, and teach that immunity is not immediate and risk-reduction behaviors remain important.",
      urgentEscalation: "Treat anaphylaxis immediately. Suspected mpox with ocular disease, airway involvement, encephalitis, severe immunocompromise, pregnancy, uncontrolled pain, or disseminated lesions needs urgent specialty/public-health care.",
      pitfalls: "Do not confuse Jynneos with ACAM2000, do not use 0.1 mL subcutaneously or 0.5 mL intradermally by assumption, do not restart a late series, and do not present risk screening in stigmatizing language.",
      related: ["Vaccinia and smallpox vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-adult-appendix-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Respiratory syncytial virus vaccine",
      aliases: ["RSV vaccine", "Abrysvo", "Arexvy", "mResvia", "maternal RSV vaccine", "adult RSV shot", "RSVpreF vaccine", "mRNA RSV vaccine"],
      abbreviations: ["RSV", "RSVpreF", "RSVPreF3", "mRNA-1345"],
      brands: ["Abrysvo", "Arexvy", "mResvia"],
      commonMisspellings: ["respitory syncytial virus vaccine", "RSV vacine", "abrisvo"],
      platform: "Prefusion-F recombinant protein vaccine with or without adjuvant, or mRNA vaccine encoding prefusion F. Pregnancy and adult products/indications are not interchangeable.",
      protectsAgainst: "Severe RSV lower-respiratory disease and hospitalization in older/high-risk adults, and severe infant RSV through maternal antibody after pregnancy vaccination.",
      mechanism: "Stabilized prefusion F antigen exposes neutralization-sensitive epitopes present before RSV fuses with airway cells. Vaccination induces antibodies that block fusion and T-cell support. In pregnancy, maternal IgG crosses the placenta and protects the newborn during the first months; in adults, the recipient's own immune memory lowers severe-disease risk.",
      routineSchedule: "Pregnancy: Abrysvo only, one dose at 32 weeks 0 days through 36 weeks 6 days during September-January in most of the continental United States. Adults: one dose for all unvaccinated age 75 or older and for unvaccinated age 50-74 at increased risk, preferably August-October. It is not currently annual and is not repeated after a prior adult dose.",
      catchUpMinimums: "No multi-dose adult series and no annual catch-up. If maternal vaccine was given in a previous pregnancy, current guidance does not repeat it in a later pregnancy; protect the later infant with Nirsevimab or Clesrovimab when eligible.",
      riskBased: "Age 50-74 indications include chronic heart/lung disease, ESRD, diabetes with complications, neurologic or neuromuscular impairment, immune compromise, frailty, severe obesity, and residence in nursing/long-term-care settings under current guidance.",
      sharedDecisionMaking: "For pregnancy, discuss maternal Abrysvo versus infant long-acting antibody. For age 50-74, identify concrete severe-RSV risk. Age 75 or older is age-based rather than shared decision-making.",
      doseCountAndSpacing: "One 0.5-mL labeled IM dose for an eligible product/recipient. No repeat adult dose is currently recommended. Maternal vaccination is one dose in the specified gestational and seasonal window.",
      doseVolumeSafety: "Abrysvo, Arexvy, and mResvia each use a labeled 0.5-mL IM dose, but preparation, age approval, antigen/adjuvant, and pregnancy authorization differ. Verify exact brand, recipient type, gestational age, season, formulation, reconstitution, volume, IM route, and label. Only Abrysvo is used in pregnancy.",
      route: "Intramuscular, generally deltoid in adults.",
      contraindications: "Severe allergy after a prior dose or to a component.",
      precautions: "Moderate/severe acute illness. For pregnancy, wrong gestational age, wrong season, or Arexvy/mResvia selection is a preventable administration error. Review prior RSV vaccination because it is not annual.",
      adverseEffects: "Injection-site pain, fatigue, headache, myalgia, arthralgia, or fever can occur. Rare neurologic safety signals are monitored; severe allergy is rare.",
      pregnancy: "Use only Abrysvo at 32 0/7-36 6/7 weeks and seasonally in most continental U.S. settings. Do not use Arexvy or mResvia in pregnancy. Most infants do not also need antibody if born at least 14 days later.",
      immunocompromise: "Immune compromise increases adult severe-disease risk and may reduce response; it does not create an annual dose. Maternal immune compromise may support rare infant antibody even after maternal vaccination.",
      nursingFocus: "Separate three decisions: pregnancy product/window, age-50-74 risk, and age-75 universal dose. Verify prior RSV vaccine, exact brand, season, gestational week, and infant plan. Document that the adult series is complete after one dose under current guidance.",
      urgentEscalation: "Treat anaphylaxis immediately. Escalate new progressive weakness or other serious neurologic symptoms and report through VAERS. Severe RSV respiratory distress remains urgent despite vaccination.",
      pitfalls: "Do not call it annual, do not inject Arexvy/mResvia in pregnancy, do not conflate vaccine with Nirsevimab or Clesrovimab, and do not routinely give both maternal vaccine and infant antibody.",
      related: ["Nirsevimab", "Clesrovimab", "Influenza vaccine", "COVID-19 vaccine"],
      sourceKeys: ["w38-cdc-rsv-pregnancy-current", "w38-cdc-rsv-adult-current", "w38-cdc-adult-age-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Pneumococcal polysaccharide vaccine",
      aliases: ["PPSV23", "Pneumovax 23", "pneumococcal 23 vaccine", "pneumonia polysaccharide shot"],
      abbreviations: ["PPSV23"],
      brands: ["Pneumovax 23"],
      commonMisspellings: ["pneumococal polysaccharide vaccine", "pneumovax23", "PPSV vacine"],
      platform: "Unconjugated purified capsular polysaccharides from 23 pneumococcal serotypes.",
      protectsAgainst: "Invasive disease from represented pneumococcal serotypes and some pneumococcal pneumonia risk; coverage is not universal and immune memory is weaker than with conjugate vaccine.",
      mechanism: "Capsular polysaccharide directly cross-links B-cell receptors and induces antibody without strong helper-T-cell recruitment. Antibody improves complement deposition and phagocytosis, but the response is weak in children younger than 2 and creates limited memory. That explains the age restriction and why PCV strategy usually comes first.",
      routineSchedule: "PPSV23 is not a stand-alone universal age-50 first choice. When PCV15 is selected for an adult with no prior PCV, give PPSV23 1 year later; an 8-week minimum is available for selected immunocompromise, cochlear implant, or CSF leak. PCV20/21 usually require no PPSV23 afterward.",
      catchUpMinimums: "History-specific. At least 1 year usually separates PCV15 and PPSV23, with 8 weeks in selected high-risk cases. Prior PPSV23 generally precedes a later PCV by at least 1 year. Complex older series require CDC decision support.",
      riskBased: "Selected children age 2 or older and adults with immune, anatomic, renal, cochlear, CSF-leak, or other risk may need PPSV23 depending on prior PCV. Recommendations vary by product history.",
      sharedDecisionMaking: "Some legacy PCV13/PPSV23 histories lead to shared decisions about later PCV20/21, not automatic repeat PPSV23.",
      doseCountAndSpacing: "Often one PPSV23 dose as part of a PCV15 sequence; selected high-risk legacy schedules may include additional historical doses. Use history-specific current guidance.",
      doseVolumeSafety: "PPSV23 is a labeled 0.5-mL dose and may be IM or SC, but it is not PCV15/20/21. Verify Pneumovax 23/PPSV23, age, risk, all prior pneumococcal dates, labeled volume, route, and whether a conjugate vaccine is the actual due product.",
      route: "Intramuscular or subcutaneous according to the product label.",
      contraindications: "Severe allergy after a prior dose or to a component.",
      precautions: "Moderate/severe acute illness. Pregnancy has no routine PPSV23 recommendation. Avoid unnecessary duplicate doses and overly short intervals.",
      adverseEffects: "Local pain, redness, swelling, fever, fatigue, headache, or myalgia can occur; large local reactions are more likely after unnecessary repeat exposure.",
      pregnancy: "No routine recommendation during pregnancy; assess unusual high-risk circumstances using current guidance.",
      immunocompromise: "High-risk conditions shape timing, but PPSV23 response may be weaker and does not replace PCV-induced memory.",
      nursingFocus: "Do not accept 'pneumonia shot' as a complete history. Retrieve every PCV/PPSV name and date, identify spleen/renal/immune/cochlear/CSF risks, and schedule PCV or PPSV precisely.",
      urgentEscalation: "Treat anaphylaxis immediately. Suspected pneumococcal meningitis or sepsis is an emergency despite vaccination.",
      pitfalls: "Do not route PCV to PPSV23, do not give PPSV23 after PCV20/21 by habit, do not use in infants, and do not repeat because a patient cannot remember the brand before checking records.",
      related: ["Pneumococcal conjugate vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-adult-notes-current", "w38-cdc-pneumococcal-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Recombinant zoster vaccine",
      aliases: ["RZV", "Shingrix", "shingles vaccine", "shingles shot", "herpes zoster recombinant vaccine"],
      abbreviations: ["RZV"],
      brands: ["Shingrix"],
      commonMisspellings: ["shingels vaccine", "shingrix vacine", "zoster recombinate vaccine"],
      platform: "Recombinant varicella-zoster glycoprotein E with a strong adjuvant; nonlive and distinct from Varicella vaccine.",
      protectsAgainst: "Herpes zoster (shingles) and postherpetic neuralgia by boosting control of latent VZV. It does not serve as primary chickenpox vaccination.",
      mechanism: "After primary infection, VZV remains latent in sensory ganglia. Aging or immune suppression weakens VZV-specific cell-mediated surveillance. Glycoprotein E plus adjuvant activates strong CD4 T-cell and antibody responses that restore immune control and reduce reactivation and nerve inflammation. Because RZV is nonlive, it can be used in many immunocompromised adults.",
      routineSchedule: "Everyone age 50 or older receives 2 doses 2-6 months apart regardless of prior shingles or live zoster vaccine. Immunocompromised adults age 19 or older receive 2 doses; the second may be accelerated to 1-2 months when a shorter series improves protection around immune therapy.",
      catchUpMinimums: "Minimum interval is 4 weeks; repeat a dose given too early. A late second dose is given when possible without restarting. Active shingles is not the time to vaccinate; wait until the acute episode resolves.",
      riskBased: "Age 19 or older with immune deficiency, immune-suppressive therapy, transplant, or HIV is indicated. Time doses before anticipated immunosuppression when feasible.",
      sharedDecisionMaking: "Timing around chemotherapy, transplant, pregnancy, or another vaccine can be individualized, but the two-dose indication is routine for age 50+ and immunocompromised age 19+.",
      doseCountAndSpacing: "Two IM doses, normally 2-6 months apart; 1-2 months can be used for immunocompromised timing. Minimum 4 weeks.",
      doseVolumeSafety: "Shingrix requires correct reconstitution of antigen with its adjuvant suspension and is administered as the labeled 0.5-mL IM dose. Verify RZV/Shingrix, both components, full reconstitution, IM route, volume, expiration after mixing, and dose number; never substitute Varivax/MMRV.",
      route: "Intramuscular, usually deltoid.",
      contraindications: "Severe allergy after a prior dose or to a component.",
      precautions: "Moderate/severe illness, active shingles, and pregnancy warrant delay. Strong expected reactogenicity is not an allergy and does not usually remove the second-dose indication.",
      adverseEffects: "Local pain, swelling, fatigue, myalgia, headache, fever, chills, or GI symptoms are common and can temporarily limit activity. Severe allergy is rare.",
      pregnancy: "No current routine recommendation; consider delaying until after pregnancy.",
      immunocompromise: "Specifically recommended from age 19 because it is nonlive. Response and optimal timing vary with therapy, but immune compromise is not the live-vaccine contraindication it is for Varivax.",
      nursingFocus: "Distinguish shingles history from primary varicella immunity, plan timing around immune therapy, prepare both components correctly, warn about one-to-three days of reactogenicity, and schedule dose 2 before discharge.",
      urgentEscalation: "Treat anaphylaxis immediately. New progressive neurologic weakness or another serious event warrants urgent assessment and VAERS reporting.",
      pitfalls: "RZV is not VAR, prior shingles does not eliminate the indication, immunocompromise is not a contraindication, and expected fever/pain after dose 1 is not automatically a reason to skip dose 2.",
      related: ["Varicella vaccine"],
      sourceKeys: ["w38-cdc-adult-notes-current", "w38-cdc-vaccine-names", "w38-cdc-contraindications"]
    },
    {
      name: "DTaP-IPV combination vaccine",
      aliases: ["Kinrix", "Quadracel", "DTaP IPV booster", "diphtheria tetanus pertussis polio combination vaccine"],
      abbreviations: ["DTaP-IPV"],
      brands: ["Kinrix", "Quadracel"],
      commonMisspellings: ["DTAP IPV combo", "kinrix vacine", "quadracell"],
      platform: "Nonlive combination of DTaP antigens and inactivated poliovirus in one preschool booster injection.",
      protectsAgainst: "Diphtheria, tetanus, pertussis, and poliomyelitis when both booster components are due.",
      mechanism: "Toxoid and acellular pertussis antigens restore toxin-neutralizing and anti-pertussis immunity, while inactivated poliovirus capsid antigens restore neutralizing antibody against viremia and paralysis. Combination reduces injections without changing antigen-specific validity rules.",
      routineSchedule: "Kinrix or Quadracel is used at age 4-6 years as DTaP dose 5 and IPV dose 4 in a child whose prior series fits the product label. It is not a primary 2-, 4-, or 6-month product.",
      catchUpMinimums: "Both components must independently meet final-dose rules: DTaP timing and IPV final dose on or after age 4 and at least 6 months after the preceding IPV. If either antigen is not due, choose appropriate separate products.",
      riskBased: "No additional risk pathway; use when both routine boosters are due and product history is compatible.",
      sharedDecisionMaking: "Choice between combination and separate injections can reflect availability and preference, but valid antigen indications are required.",
      doseCountAndSpacing: "One preschool IM combination dose credits one DTaP and one IPV event.",
      doseVolumeSafety: "Use the labeled 0.5-mL IM dose only after verifying Kinrix/Quadracel, age 4-6, prior DTaP/IPV products, both due antigens, route, and label. Never split the syringe or count it as Hib/HepB.",
      route: "Intramuscular.",
      contraindications: "Contraindications of either DTaP or IPV component, including severe allergy and qualifying prior pertussis-vaccine encephalopathy.",
      precautions: "Apply all DTaP neurologic/Arthus/GBS precautions plus acute-illness and component-allergy review.",
      adverseEffects: "Local pain/swelling, fever, fatigue, or irritability can occur; severe allergy is rare.",
      pregnancy: "Pediatric preschool product; not for pregnancy.",
      immunocompromise: "Nonlive; response may be reduced but immune compromise is not a live-vaccine contraindication.",
      nursingFocus: "Run separate DTaP and IPV validity checks, scan the exact product, and document both antigen credits.",
      urgentEscalation: "Treat anaphylaxis and severe neurologic reactions urgently and report through VAERS.",
      pitfalls: "Do not use for infant priming, do not give when only one antigen is due, and do not miss the IPV age-4 final-dose rule.",
      related: ["DTaP vaccine", "Inactivated poliovirus vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "DTaP-HepB-IPV combination vaccine",
      aliases: ["Pediarix", "DTaP hepatitis B polio vaccine", "DTaP-HepB-IPV"],
      abbreviations: ["DTaP-HepB-IPV"],
      brands: ["Pediarix"],
      commonMisspellings: ["pediarix vacine", "pediatrix vaccine", "DTAP Hep B IPV combo"],
      platform: "Nonlive DTaP, recombinant HepB, and IPV antigens in one pediatric primary-series injection.",
      protectsAgainst: "Diphtheria, tetanus, pertussis, hepatitis B, and poliomyelitis.",
      mechanism: "Each component creates its own toxin-neutralizing, antiviral, or antibacterial immunity; combining them changes injection count but not the immune mechanism or minimum age/interval of each antigen.",
      routineSchedule: "Pediarix is licensed as a 3-dose primary series at 2, 4, and 6 months for age 6 weeks through 6 years. The HepB birth dose remains required; a valid Pediarix series can therefore produce four recorded HepB doses.",
      catchUpMinimums: "Use only when every included component is indicated and the most restrictive minimum age/interval is met. It is not licensed as the DTaP/IPV preschool booster.",
      riskBased: "Routine-product option rather than a separate risk indication.",
      sharedDecisionMaking: "Combination versus separate products can reflect availability and injection burden, but do not omit the HepB birth dose.",
      doseCountAndSpacing: "Three IM combination doses at 2, 4, 6 months, each crediting DTaP, HepB, and IPV.",
      doseVolumeSafety: "Verify Pediarix, labeled 0.5-mL IM dose, age, all three component histories, and package label. Do not use as a birth dose, Hib dose, or preschool booster.",
      route: "Intramuscular.",
      contraindications: "Any component contraindication, including severe allergy or qualifying pertussis-vaccine encephalopathy.",
      precautions: "Apply DTaP neurologic precautions, HepB component-allergy review, and IPV component review.",
      adverseEffects: "Local reactions, fever, irritability, fatigue, or appetite change can occur.",
      pregnancy: "Pediatric product; not used in pregnancy.",
      immunocompromise: "Nonlive; response may be reduced.",
      nursingFocus: "Preserve the monovalent HepB birth-dose pathway and document three antigen credits per injection.",
      urgentEscalation: "Treat anaphylaxis or severe neurologic change urgently.",
      pitfalls: "Do not give at birth, do not count as Hib, do not omit HepB dose 1, and do not use for DTaP dose 4/5.",
      related: ["DTaP vaccine", "Hepatitis B vaccine", "Inactivated poliovirus vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "DTaP-IPV-Hib combination vaccine",
      aliases: ["Pentacel", "DTaP polio Hib vaccine", "DTaP-IPV/Hib"],
      abbreviations: ["DTaP-IPV/Hib"],
      brands: ["Pentacel"],
      commonMisspellings: ["pentacell", "pentacel vacine", "DTAP IPV HIB combo"],
      platform: "Nonlive DTaP, IPV, and Hib conjugate antigens in one product requiring correct reconstitution.",
      protectsAgainst: "Diphtheria, tetanus, pertussis, poliomyelitis, and invasive Hib disease.",
      mechanism: "Toxoid/acellular antigens, inactivated poliovirus, and protein-conjugated Hib capsule each induce antigen-specific antibody and memory; the Hib conjugate specifically enables an infant T-cell-dependent response.",
      routineSchedule: "Pentacel is a 4-dose series at 2, 4, 6, and 15-18 months for age 6 weeks through 4 years. It does not supply HepB and is not the age-4-6 preschool DTaP/IPV booster product.",
      catchUpMinimums: "Every component must be due and satisfy its own interval. Hib product history changes series interpretation; use the CDC catch-up table.",
      riskBased: "Routine-product option; later Hib risk indications remain separate.",
      sharedDecisionMaking: "Combination can reduce injections when all components are due.",
      doseCountAndSpacing: "Four IM doses in its routine infant/toddler series.",
      doseVolumeSafety: "Reconstitute the Hib component only with the supplied DTaP-IPV liquid as labeled, then give the full labeled 0.5-mL IM dose. Verify Pentacel, age, all component histories, diluent pairing, and expiration after mixing.",
      route: "Intramuscular after correct reconstitution.",
      contraindications: "Any DTaP, IPV, or Hib component contraindication.",
      precautions: "Apply DTaP neurologic/Arthus/GBS precautions and acute-illness review.",
      adverseEffects: "Local pain/swelling, fever, fussiness, fatigue, or appetite change can occur.",
      pregnancy: "Pediatric product; not for pregnancy.",
      immunocompromise: "Nonlive; response may be reduced.",
      nursingFocus: "Verify supplied components and reconstitution, then record DTaP, IPV, and Hib credits but not HepB.",
      urgentEscalation: "Treat anaphylaxis and severe neurologic events urgently.",
      pitfalls: "Do not count as HepB, do not use past age limits, and do not use an unrelated diluent.",
      related: ["DTaP vaccine", "Inactivated poliovirus vaccine", "Haemophilus influenzae type b vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "DTaP-IPV-Hib-HepB combination vaccine",
      aliases: ["Vaxelis", "six antigen pediatric vaccine", "DTaP-IPV-Hib-HepB"],
      abbreviations: ["DTaP-IPV-Hib-HepB"],
      brands: ["Vaxelis"],
      commonMisspellings: ["vaxellis", "vaxelis vacine", "DTAP IPV HIB HEPB combo"],
      platform: "Nonlive hexavalent product combining DTaP, IPV, Hib conjugate, and recombinant HepB antigens.",
      protectsAgainst: "Diphtheria, tetanus, pertussis, poliomyelitis, invasive Hib disease, and hepatitis B.",
      mechanism: "Six antigen groups stimulate their own neutralizing, toxin-blocking, opsonizing, or memory responses; combination reduces injections without merging validity rules.",
      routineSchedule: "Vaxelis is used at 2, 4, and 6 months for age 6 weeks through 4 years. It is not used for the HepB birth dose, DTaP booster dose 4/5, or Hib booster dose.",
      catchUpMinimums: "All included antigens must be due, and the most restrictive interval controls. Prior Hib and HepB products must be counted separately.",
      riskBased: "Routine-product option rather than a new risk indication.",
      sharedDecisionMaking: "Combination reduces injections when it fits the antigen plan.",
      doseCountAndSpacing: "Three IM primary-series doses, each crediting DTaP, IPV, Hib, and HepB.",
      doseVolumeSafety: "Give the labeled 0.5-mL IM dose only after verifying Vaxelis, age, all component histories, and label. Do not use as birth HepB or toddler/preschool booster.",
      route: "Intramuscular.",
      contraindications: "Any component contraindication, including severe allergy or qualifying pertussis-vaccine encephalopathy.",
      precautions: "Apply DTaP neurologic precautions, acute-illness review, and component allergy screening.",
      adverseEffects: "Local reactions, fever, irritability, sleepiness, or appetite change can occur.",
      pregnancy: "Pediatric product; not for pregnancy.",
      immunocompromise: "Nonlive; response may be reduced.",
      nursingFocus: "Document four component credits and preserve separate birth-dose and booster requirements.",
      urgentEscalation: "Treat anaphylaxis or severe neurologic change urgently.",
      pitfalls: "Do not treat six antigens as six doses, do not give at birth, and do not use as Hib or DTaP booster.",
      related: ["DTaP vaccine", "Inactivated poliovirus vaccine", "Haemophilus influenzae type b vaccine", "Hepatitis B vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Hepatitis A-Hepatitis B combination vaccine",
      aliases: ["Twinrix", "HepA HepB combination vaccine", "combined hepatitis vaccine"],
      abbreviations: ["HepA-HepB"],
      brands: ["Twinrix"],
      commonMisspellings: ["twinrix vacine", "twin rix", "hepatitis A B combo"],
      platform: "Adult combination of inactivated HepA antigen and recombinant HepB surface antigen.",
      protectsAgainst: "Hepatitis A and hepatitis B when both vaccine series are indicated.",
      mechanism: "Inactivated HAV induces neutralizing anti-HAV memory, while recombinant HBsAg induces anti-HBs antibody that blocks HBV entry; one injection does not make their schedules biologically identical.",
      routineSchedule: "For eligible adults age 18 or older: 3 doses at 0, 1, and 6 months, or accelerated doses at days 0, 7, and 21-30 followed by a booster at month 12.",
      catchUpMinimums: "Standard minimums are 4 weeks from dose 1 to 2 and 5 months from dose 2 to 3. Continue rather than restart. Accelerated schedule requires the 12-month fourth dose.",
      riskBased: "Useful when both HepA and HepB are indicated by travel, liver disease, exposure, occupation, or request.",
      sharedDecisionMaking: "Choice of Twinrix versus separate products depends on age, deadlines, prior antigen-specific doses, pregnancy/product guidance, and access.",
      doseCountAndSpacing: "Three standard or four accelerated IM doses.",
      doseVolumeSafety: "Twinrix is a labeled 1-mL adult IM dose containing a pediatric quantity of HepA antigen and adult HepB antigen. Verify age 18+, both indications, series pathway, prior single-antigen doses, route, and label; do not use it as a pediatric HepA or birth HepB dose.",
      route: "Intramuscular.",
      contraindications: "Severe allergy to prior HepA/HepB product or component, including relevant yeast allergy.",
      precautions: "Moderate/severe illness and product-specific pregnancy review.",
      adverseEffects: "Local soreness, headache, fatigue, or fever can occur.",
      pregnancy: "Use current HepA/HepB pregnancy guidance and product information when both protections are indicated.",
      immunocompromise: "Nonlive; response may be reduced and serology can be indicated for HepB in selected groups.",
      nursingFocus: "Track HepA and HepB credits separately and schedule the 12-month dose after an accelerated start.",
      urgentEscalation: "Treat anaphylaxis immediately.",
      pitfalls: "Do not omit the accelerated booster, apply Twinrix to children, or count one Twinrix dose as a complete HepA/HepB series.",
      related: ["Hepatitis A vaccine", "Hepatitis B vaccine"],
      sourceKeys: ["w38-cdc-adult-notes-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "MMRV combination vaccine",
      aliases: ["ProQuad", "measles mumps rubella varicella vaccine", "MMR plus chickenpox vaccine"],
      abbreviations: ["MMRV"],
      brands: ["ProQuad"],
      commonMisspellings: ["MMRV vacine", "pro quad vaccine", "MMR varicela combo"],
      platform: "Live attenuated measles, mumps, rubella, and varicella viruses in one pediatric product.",
      protectsAgainst: "Measles, mumps, rubella, and primary varicella in eligible children.",
      mechanism: "Limited replication of four attenuated viruses creates neutralizing antibodies and T-cell memory; live replication explains immune, pregnancy, blood-product, and spacing restrictions.",
      routineSchedule: "Licensed age 12 months through 12 years for two-dose MMR/varicella vaccination. For dose 1 at age 12-47 months, separate MMR vaccine and Varicella vaccine are preferred unless the caregiver prefers MMRV after counseling about febrile-seizure risk. MMRV is often used for dose 2 at age 4-6.",
      catchUpMinimums: "The minimum interval between MMRV doses is 3 months. Do not use after age 12.",
      riskBased: "Routine combination option when both MMR and VAR are due.",
      sharedDecisionMaking: "For first dose age 12-47 months, discuss one injection versus the higher short-term febrile-seizure risk compared with separate same-visit MMR and VAR.",
      doseCountAndSpacing: "One MMRV dose credits one MMR and one VAR dose; two antigen-valid doses are needed overall.",
      doseVolumeSafety: "Reconstitute ProQuad with its supplied diluent and give the full labeled 0.5-mL subcutaneous dose. Verify age, both antigens due, live-vaccine timing, route, and label; never substitute Shingrix.",
      route: "Subcutaneous.",
      contraindications: "All MMR and VAR live-vaccine contraindications, including pregnancy and severe immunodeficiency.",
      precautions: "Blood products, acute illness, seizure history, and other live-vaccine timing require review.",
      adverseEffects: "Fever, rash, local symptoms, and febrile seizure can occur, especially after first dose in age 12-23 months.",
      pregnancy: "Contraindicated; pediatric age limits also apply.",
      immunocompromise: "Severe immunocompromise is a contraindication.",
      nursingFocus: "Counsel caregivers on first-dose options, document both antigen credits, and teach fever/seizure precautions.",
      urgentEscalation: "Treat anaphylaxis or prolonged seizure urgently.",
      pitfalls: "Do not confuse MMRV with RZV, use past age 12, or hide the first-dose febrile-seizure tradeoff.",
      related: ["MMR vaccine", "Varicella vaccine", "Recombinant zoster vaccine"],
      sourceKeys: ["w38-cdc-child-notes-current", "w38-cdc-child-catchup-current", "w38-cdc-vaccine-names"]
    },
    {
      name: "Adenovirus type 4 and 7 vaccine",
      aliases: ["adenovirus vaccine", "military adenovirus vaccine", "adenovirus type 4 type 7 tablets"],
      abbreviations: ["Ad4/Ad7"],
      brands: ["Adenovirus Type 4 and Type 7 Vaccine, Live, Oral"],
      commonMisspellings: ["adeno virus vaccine", "adenovirus vacine"],
      platform: "Two live oral enteric-coated tablets containing adenovirus types 4 and 7, licensed for defined U.S. military populations.",
      protectsAgainst: "Febrile acute respiratory disease caused by adenovirus types 4 and 7 in high-transmission military training settings; it is not a general civilian adenovirus vaccine.",
      mechanism: "The live viruses replicate mainly in the intestine and generate type-specific neutralizing and mucosal immunity without intentionally producing respiratory infection. Enteric coating preserves the organisms through the stomach, so tablets must be swallowed whole.",
      routineSchedule: "One administration consisting of both type-4 and type-7 tablets for eligible military personnel age 17-50 under Department of Defense policy. No routine civilian schedule exists.",
      catchUpMinimums: "No multi-dose routine series or catch-up schedule; eligibility and revaccination follow military policy.",
      riskBased: "Limited to the military setting for which the product is licensed and recommended.",
      sharedDecisionMaking: "Not a general travel or civilian preference vaccine.",
      doseCountAndSpacing: "One event: swallow one tablet of each type together; do not chew or crush.",
      doseVolumeSafety: "This is not an mL dose. Verify two correct enteric-coated oral tablets, eligible age/military status, intact coating, oral route, and current package instructions. Do not administer by injection.",
      route: "Oral tablets swallowed whole.",
      contraindications: "Severe allergy, pregnancy, or inability to swallow intact tablets; follow current label for immune and close-contact restrictions.",
      precautions: "Moderate/severe illness, vomiting/diarrhea, immune compromise, and close contact with very young, pregnant, or immunocompromised people require review because vaccine virus is shed in stool.",
      adverseEffects: "Headache, upper-respiratory or GI symptoms, fever, or fatigue can occur; serious events are uncommon.",
      pregnancy: "Contraindicated. Avoid pregnancy for the labeled period after vaccination.",
      immunocompromise: "Live product; assess recipient and close-contact risk under military guidance.",
      nursingFocus: "Confirm both tablets were swallowed whole, reinforce hand hygiene after toileting for 28 days, and document both types as one administration event.",
      urgentEscalation: "Treat anaphylaxis or severe systemic illness urgently and report as required.",
      pitfalls: "Do not give to civilians as a generic adenovirus shot, chew tablets, or record two tablets as two series doses.",
      related: ["Influenza vaccine"],
      sourceKeys: ["w38-cdc-adenovirus-vaccine", "w38-cdc-vaccine-names"]
    },
    {
      name: "Anthrax vaccine",
      aliases: ["BioThrax", "Cyfendus", "AVA vaccine", "anthrax shot", "anthrax postexposure vaccine"],
      abbreviations: ["AVA"],
      brands: ["BioThrax", "Cyfendus"],
      commonMisspellings: ["anthrax vacine", "biothax", "cyfendus shot"],
      platform: "Cell-free protective-antigen vaccine; Cyfendus adds an immune-stimulating adjuvant for a specific postexposure regimen.",
      protectsAgainst: "Toxin-mediated anthrax disease when used before occupational exposure or with antibiotics after a suspected aerosol exposure.",
      mechanism: "Antibodies against protective antigen prevent assembly and cell entry of lethal and edema toxins. Vaccine cannot eliminate germinating spores immediately, so postexposure protection must be paired with the full antimicrobial course.",
      routineSchedule: "High-risk preexposure BioThrax uses a 3-dose primary IM series at 0, 1, and 6 months with boosters for ongoing risk. Postexposure schedules are product-specific: BioThrax or Cyfendus is given on an accelerated weeks-based schedule together with antibiotics under public-health direction.",
      catchUpMinimums: "Do not improvise intervals; continue an interrupted occupational series using current CDC guidance. PEP timing follows incident command and cannot be replaced by the routine series.",
      riskBased: "Certain laboratory, military, responder, livestock/product, or confirmed/suspected exposure settings only.",
      sharedDecisionMaking: "Risk-benefit decisions occur with occupational/public-health experts, especially pregnancy; this is not a general public vaccine.",
      doseCountAndSpacing: "Preexposure 3-dose primary plus risk-based boosters; PEP uses accelerated product-specific doses plus prolonged antimicrobial prophylaxis.",
      doseVolumeSafety: "BioThrax route and dose volume differ between preexposure and postexposure use, and Cyfendus is a different presentation. Verify indication, brand, formulation, age, route, volume, schedule day, and source order; never infer PEP administration from a routine card.",
      route: "Intramuscular for routine preexposure; BioThrax PEP can use subcutaneous administration under current guidance. Follow exact product protocol.",
      contraindications: "Severe allergy after a prior dose/component; in a life-threatening exposure, expert risk-benefit decisions may override routine deferral.",
      precautions: "Moderate/severe illness, pregnancy, immune suppression, and prior severe local reaction require expert review.",
      adverseEffects: "Local pain, swelling, limited arm motion, fatigue, headache, myalgia, or fever can occur.",
      pregnancy: "Avoid routine preexposure vaccination unless exposure risk is high; PEP should not be withheld when anthrax risk is credible.",
      immunocompromise: "Nonlive but response may be reduced; never shorten antibiotics because vaccinated.",
      nursingFocus: "Verify exposure category, product, route, dose day, concurrent antibiotics, and follow-up; use incident/public-health protocols.",
      urgentEscalation: "Suspected anthrax exposure or compatible systemic illness is an emergency requiring public health and treatment; vaccine alone is not treatment.",
      pitfalls: "Do not omit antibiotics after exposure, confuse BioThrax with Cyfendus, or apply occupational boosters to the public.",
      related: ["Vaccinia and smallpox vaccine"],
      sourceKeys: ["w38-cdc-anthrax-vaccine", "w38-cdc-vaccine-names"]
    },
    {
      name: "Chikungunya vaccine",
      aliases: ["Ixchiq historical chikungunya vaccine", "Vimkunya", "chikungunya travel vaccine", "CHIK vaccine", "chikungunya VLP vaccine"],
      abbreviations: ["CHIK-VLP"],
      brands: ["Vimkunya"],
      commonMisspellings: ["chikengunya vaccine", "chikungunya vacine", "ixchic"],
      platform: "VIMKUNYA is a nonlive recombinant virus-like-particle vaccine. The previously marketed live Ixchiq product is not a current U.S. option because FDA suspended its biologics license on August 22, 2025 for serious safety concerns.",
      protectsAgainst: "Chikungunya illness, including fever and potentially prolonged disabling arthralgia, in travelers or persons with outbreak/laboratory risk.",
      mechanism: "VIMKUNYA's virus-like particles display chikungunya structural proteins in a virus-shaped array without containing material that can replicate. B cells recognize the repeated surface geometry efficiently, while antigen presentation activates T-cell help; the resulting neutralizing antibodies can block viral entry and dissemination without the recipient being exposed to a live vaccine strain.",
      routineSchedule: "One VIMKUNYA dose for people age 12 years or older traveling to a country or territory with a chikungunya outbreak, and for laboratory workers with potential chikungunya-virus exposure. It may be considered at age 12 or older for travel or relocation of about 6 months or longer to a place with elevated risk even without a current outbreak. Follow current CDC destination guidance.",
      catchUpMinimums: "VIMKUNYA is a single-dose vaccine. There is no catch-up series and currently no booster recommendation.",
      riskBased: "Destination outbreak, elevated destination risk, a stay of about 6 months or longer, likelihood of mosquito exposure, age 12 or older, and qualifying laboratory work determine use. Routine handling of ordinary clinical specimens does not itself create the laboratory indication.",
      sharedDecisionMaking: "For longer travel to an elevated-risk area without an outbreak, discuss exposure likelihood, potentially prolonged joint disease, incomplete duration-of-protection data, pregnancy, immune status, and patient preferences. Most U.S. travelers have low risk, so destination and itinerary matter.",
      doseCountAndSpacing: "One 0.8-mL IM dose of VIMKUNYA; currently no booster dose is recommended.",
      doseVolumeSafety: "VIMKUNYA is administered as one labeled 0.8-mL intramuscular dose. Verify VIMKUNYA, age 12 years or older, current destination/laboratory indication, product and expiration, volume, IM route, and current CDC/FDA status. Do not substitute or administer Ixchiq; its FDA biologics license is suspended.",
      route: "Intramuscular.",
      contraindications: "A history of severe allergic reaction, such as anaphylaxis, to a VIMKUNYA component is a contraindication.",
      precautions: "Immunocompromise can reduce the immune response. Moderate or severe acute illness generally warrants deferral. Pregnancy requires individualized exposure-versus-vaccination discussion and, when feasible, travel deferral.",
      adverseEffects: "Injection-site pain, fatigue, headache, and myalgia are common. Syncope can follow an injection; severe allergy is rare. Long-term duration-of-protection data are still developing.",
      pregnancy: "Avoid chikungunya exposure when possible and generally defer vaccination until after delivery. If infection risk is high and unavoidable, discuss benefits and uncertainties; if vaccination is chosen, CDC notes that waiting until after 14 weeks and giving it at least 2 weeks before expected delivery may be preferred when timing allows.",
      immunocompromise: "VIMKUNYA is nonlive and cannot cause vaccine-strain replication, but immunocompromised people may have a diminished response. Coordinate timing around immunosuppressive treatment when feasible without missing a meaningful exposure window.",
      nursingFocus: "Check age 12 or older, destination and dates, outbreak/elevated-risk status, duration, laboratory task, pregnancy and immune status, and verify the 0.8-mL IM VIMKUNYA product. Document that mosquito prevention remains necessary because vaccination does not prevent every infection.",
      urgentEscalation: "Treat anaphylaxis immediately. Severe neurologic, cardiac, systemic, or prolonged symptoms after vaccination need urgent assessment and reporting; a returned traveler with fever and severe arthralgia also needs evaluation for chikungunya and other travel infections.",
      pitfalls: "Do not present Ixchiq as available: FDA suspended its biologics license in 2025. Do not vaccinate a child younger than 12, invent a booster, omit itinerary assessment, or imply that VIMKUNYA replaces mosquito-bite prevention.",
      related: ["Dengue vaccine", "Yellow fever vaccine"],
      sourceKeys: ["w38-cdc-chikungunya-vaccine", "w38-fda-ixchiq-suspended", "w38-cdc-vaccine-names"]
    },
    {
      name: "Cholera vaccine",
      aliases: ["Vaxchora", "oral cholera vaccine", "CVD 103-HgR", "cholera travel vaccine"],
      abbreviations: ["CVD 103-HgR"],
      brands: ["Vaxchora"],
      commonMisspellings: ["colera vaccine", "cholera vacine", "vaxchora drink"],
      platform: "Single-dose live attenuated oral Vibrio cholerae O1 vaccine.",
      protectsAgainst: "Severe O1 cholera in eligible travelers to an area of active transmission; it does not cover O139 or replace safe food/water practices.",
      mechanism: "Attenuated bacteria transiently expose the intestinal immune system to O1 antigens, inducing vibriocidal antibody and mucosal responses that limit colonization and toxin-mediated secretory diarrhea.",
      routineSchedule: "One oral dose for age 2-64 traveling to an area with active cholera transmission, completed at least 10 days before exposure. Not routinely recommended for most travelers.",
      catchUpMinimums: "Single-dose product; no catch-up series or routine booster is established.",
      riskBased: "Destination-specific active transmission and exposure pattern determine use.",
      sharedDecisionMaking: "Discuss actual destination risk, ability to follow food/water precautions, age, pregnancy, immune status, and recent antibiotics.",
      doseCountAndSpacing: "One reconstituted oral dose at least 10 days before travel.",
      doseVolumeSafety: "Reconstitute exactly with the supplied buffer/water volume for the recipient's age and administer the full oral preparation. Verify Vaxchora, age 2-64, oral route, recent antibiotics, food/drink timing, and package directions; never inject it.",
      route: "Oral liquid; avoid food/drink for the labeled interval around administration.",
      contraindications: "Severe allergy to a prior dose/component; live-product immune restrictions apply.",
      precautions: "Pregnancy, immune compromise, acute GI illness, and antibiotics can affect risk or response.",
      adverseEffects: "Fatigue, headache, abdominal pain, nausea/vomiting, appetite loss, or diarrhea can occur.",
      pregnancy: "Use only after travel-risk assessment because data are limited; consider avoiding high-risk travel.",
      immunocompromise: "Live oral product requires specialist review.",
      nursingFocus: "Confirm active-transmission destination, departure date, reconstitution, ingestion, and continued food/water hygiene.",
      urgentEscalation: "Profuse watery diarrhea, severe dehydration, shock, or suspected cholera needs emergency rehydration and public-health action.",
      pitfalls: "Do not vaccinate every traveler, inject the product, or imply it replaces safe water and prompt oral rehydration.",
      related: ["Typhoid vaccine"],
      sourceKeys: ["w38-cdc-cholera-vaccine", "w38-cdc-vaccine-names"]
    },
    {
      name: "Ebola vaccine",
      aliases: ["Ervebo", "rVSV-ZEBOV vaccine", "Ebola Zaire vaccine", "Ebola outbreak vaccine"],
      abbreviations: ["rVSV-ZEBOV", "rVSVdeltaG-ZEBOV-GP"],
      brands: ["Ervebo"],
      commonMisspellings: ["ebolla vaccine", "ebola vacine", "ervebo shot"],
      platform: "Live recombinant replicating vesicular stomatitis virus expressing Zaire ebolavirus glycoprotein.",
      protectsAgainst: "Disease caused by Zaire ebolavirus in people with defined occupational or outbreak risk; it does not cover every Ebola species.",
      mechanism: "The vector replicates transiently and displays Ebola glycoprotein, producing neutralizing antibody and T-cell responses without exposing the recipient to Ebola virus itself.",
      routineSchedule: "One IM dose for designated laboratory, response, treatment-unit, or outbreak populations under CDC/public-health guidance. No routine population schedule.",
      catchUpMinimums: "Single-dose primary vaccination; boosters are determined by current occupational policy.",
      riskBased: "Work with Ebola virus, deployment to an outbreak, or designated treatment/response roles.",
      sharedDecisionMaking: "Coordinate with occupational health and public health; indication is not ordinary travel alone.",
      doseCountAndSpacing: "One labeled IM dose.",
      doseVolumeSafety: "Verify Ervebo, current age approval, Zaire-risk indication, live-vector status, labeled 1-mL IM dose, thawing/storage, route, and package instructions.",
      route: "Intramuscular.",
      contraindications: "Severe allergy to a component; live-vector restrictions require review.",
      precautions: "Pregnancy, breastfeeding, immune compromise, and close contact with high-risk people require occupational expert guidance.",
      adverseEffects: "Injection pain, headache, fever, fatigue, myalgia, arthralgia, nausea, or rash can occur; vaccine-virus shedding/events are monitored.",
      pregnancy: "Outbreak exposure may outweigh theoretical live-vector risk; use expert guidance.",
      immunocompromise: "Replicating vector requires specialist risk-benefit assessment.",
      nursingFocus: "Confirm the Ebola species/risk role, cold-chain handling, live-vector counseling, and occupational follow-up.",
      urgentEscalation: "Possible Ebola exposure or compatible febrile illness requires immediate isolation and public-health protocol regardless of vaccination.",
      pitfalls: "Do not imply protection against all ebolaviruses or use as routine tourism vaccination.",
      related: ["Yellow fever vaccine"],
      sourceKeys: ["w38-cdc-ebola-vaccine", "w38-cdc-vaccine-names"]
    },
    {
      name: "Japanese encephalitis vaccine",
      aliases: ["Ixiaro", "JE vaccine", "Japanese encephalitis shot", "JEV vaccine"],
      abbreviations: ["JE", "JEV"],
      brands: ["Ixiaro"],
      commonMisspellings: ["japanese encaphalitis vaccine", "JE vacine", "ixiario"],
      platform: "Inactivated, purified Japanese encephalitis virus vaccine with adjuvant.",
      protectsAgainst: "Japanese encephalitis, a mosquito-borne infection that is uncommon in travelers but can cause death or permanent neurologic disability.",
      mechanism: "Inactivated viral antigens generate neutralizing antibodies that block viremia and neuroinvasion; vaccine cannot replicate or cause JE.",
      routineSchedule: "Risk-based 2-dose series for age 2 months or older: days 0 and 28; age 18-65 may receive dose 2 at days 7-28 when accelerated. Complete the series at least 1 week before travel. Give a booster at least 1 year later if exposure risk continues or recurs.",
      catchUpMinimums: "Use age-specific 7- or 28-day interval rules; delayed dose is continued, not restarted.",
      riskBased: "Longer stay in endemic areas, travel during transmission season, extensive rural/outdoor exposure, outbreak, uncertain itinerary, or laboratory work.",
      sharedDecisionMaking: "Short-term urban travel often has low risk; discuss itinerary, season, duration, nighttime mosquito exposure, and severe outcome.",
      doseCountAndSpacing: "Two IM doses plus a risk-based booster at least 1 year later.",
      doseVolumeSafety: "Ixiaro volume is age-specific: verify age, prefilled syringe dose preparation, series day, labeled IM volume, route, and travel date. Do not use an adult volume for a young child without following the label.",
      route: "Intramuscular.",
      contraindications: "Severe allergy after a prior dose/component.",
      precautions: "Moderate/severe illness; pregnancy generally warrants deferral unless travel risk outweighs uncertainty.",
      adverseEffects: "Local pain/tenderness, fever in children, headache or myalgia can occur.",
      pregnancy: "Usually defer unless high-risk travel cannot be avoided.",
      immunocompromise: "Nonlive but response may be reduced.",
      nursingFocus: "Map exact itinerary/season, ensure dose 2 and one-week lead time, and reinforce mosquito precautions.",
      urgentEscalation: "Encephalitis symptoms require emergency evaluation regardless of vaccination.",
      pitfalls: "Do not vaccinate solely because a traveler visits Asia; use itinerary risk and do not forget the one-week completion lead time.",
      related: ["Yellow fever vaccine", "Typhoid vaccine"],
      sourceKeys: ["w38-cdc-je-vaccine", "w38-cdc-vaccine-names"]
    },
    {
      name: "Rabies vaccine",
      aliases: ["rabies shot", "Imovax Rabies", "RabAvert", "rabies PrEP", "rabies PEP", "postexposure rabies vaccine"],
      abbreviations: ["PrEP", "PEP", "HDCV", "PCECV"],
      brands: ["Imovax Rabies", "RabAvert"],
      commonMisspellings: ["rabies vacine", "rabies post exposure shots", "rabiavert"],
      platform: "Inactivated cell-culture rabies virus vaccine; human rabies immune globulin supplies immediate passive antibody for eligible unvaccinated exposures.",
      protectsAgainst: "Rabies after occupational/travel risk or animal exposure. Once clinical rabies begins, vaccine is not effective treatment and disease is almost uniformly fatal.",
      mechanism: "Vaccine induces neutralizing antibody before virus reaches peripheral nerves or CNS. HRIG placed into and around the wound supplies immediate local antibody while active immunity develops, explaining why wound care, HRIG, and timed vaccine are all needed after exposure in an unvaccinated person.",
      routineSchedule: "PrEP for risk categories uses 2 IM doses on days 0 and 7, followed by titer or booster strategy for sustained risk. PEP if unvaccinated: wound cleansing, HRIG once, and vaccine days 0, 3, 7, 14; add day 28 for immune disorders. Previously vaccinated: vaccine days 0 and 3 without HRIG.",
      catchUpMinimums: "PEP delays require immediate expert/public-health consultation; do not restart casually or abandon the schedule. PrEP titer/booster timing follows risk category.",
      riskBased: "Animal work, bat/cave exposure, travel where dog rabies and access to PEP are concerns, laboratory work, and actual bites/scratches/mucosal exposure.",
      sharedDecisionMaking: "PrEP travel decisions use destination, activity, duration, child contact with animals, and access to prompt PEP. PEP after a credible exposure is urgent risk management, not optional routine care.",
      doseCountAndSpacing: "PrEP 2 doses days 0/7 plus risk strategy. PEP 4 vaccine doses or 5 if immunocompromised; prior vaccinated PEP 2 doses.",
      doseVolumeSafety: "Rabies vaccine products use a labeled 1-mL IM dose, while HRIG is weight-based IU/kg and must be infiltrated into wounds rather than mixed with vaccine. Verify product, history, immune status, schedule day, IM site, volume, HRIG product/concentration, and separate anatomy.",
      route: "Vaccine IM in deltoid; anterolateral thigh for small child. Never gluteal. HRIG infiltrated in/around wounds with remainder IM distant from vaccine.",
      contraindications: "For PEP, there are no routine contraindications when exposure is credible. PrEP severe allergy requires expert assessment.",
      precautions: "Immune suppression changes dose count/titer; chloroquine can affect intradermal regimens not used routinely in the U.S.",
      adverseEffects: "Local pain/itching, headache, nausea, abdominal pain, myalgia, or dizziness can occur.",
      pregnancy: "Pregnancy is not a contraindication to PEP; high-risk PrEP can be given.",
      immunocompromise: "PEP adds day 28 and post-series titer; coordinate immune-suppressive therapy when possible.",
      nursingFocus: "Wash wounds immediately, contact public health, identify animal/species/location/availability for testing, reconstruct prior vaccine, infiltrate HRIG correctly, and schedule every date.",
      urgentEscalation: "Every credible exposure is time-sensitive. Clinical neurologic rabies requires immediate specialty/public-health care.",
      pitfalls: "Do not inject HRIG and vaccine together, use the gluteal site, give HRIG to a previously vaccinated person, or wait for symptoms.",
      related: ["Tdap vaccine", "Td vaccine"],
      sourceKeys: ["w38-cdc-rabies-prep", "w38-cdc-rabies-pep", "w38-cdc-vaccine-names"]
    },
    {
      name: "Typhoid vaccine",
      aliases: ["Typhim Vi", "Vivotif", "typhoid fever vaccine", "typhoid travel shot", "oral typhoid vaccine"],
      abbreviations: ["ViCPS", "Ty21a"],
      brands: ["Typhim Vi", "Vivotif"],
      commonMisspellings: ["tyfoid vaccine", "typhoid vacine", "vivatif"],
      platform: "Injectable Vi capsular polysaccharide vaccine or live attenuated oral Ty21a capsules.",
      protectsAgainst: "Typhoid fever from Salmonella Typhi in travelers and selected exposure groups; neither product is fully protective or a substitute for food/water precautions.",
      mechanism: "ViCPS induces anticapsular antibody; oral Ty21a replicates transiently in the gut and induces mucosal and systemic immunity. Different platforms explain age, pregnancy, immune, antibiotic, route, and booster differences.",
      routineSchedule: "Typhim Vi: one IM dose age 2 or older at least 2 weeks before travel, booster every 2 years if risk continues. Vivotif: age 6 or older, 4 capsules on days 0, 2, 4, 6 completed at least 1 week before exposure, booster every 5 years if risk continues.",
      catchUpMinimums: "Oral capsules must follow the alternate-day series; if interrupted, obtain product-specific guidance rather than compressing. Injectable is one dose.",
      riskBased: "Travel to places with typhoid risk, close contact with a chronic carrier, or laboratory exposure.",
      sharedDecisionMaking: "Choose product using age, departure date, pregnancy, immune status, antibiotics, adherence, and preference.",
      doseCountAndSpacing: "One IM injection or four oral capsules on alternate days; risk-based boosters differ by product.",
      doseVolumeSafety: "Typhim Vi is a labeled 0.5-mL IM dose; Vivotif is not a liquid dose and uses four refrigerated capsules. Verify brand, age, route, schedule, storage, antibiotics, and travel date; never inject an oral capsule product.",
      route: "Intramuscular for Typhim Vi; oral capsules swallowed whole with cool liquid for Vivotif.",
      contraindications: "Severe allergy; live Vivotif is contraindicated in pregnancy and immunocompromise.",
      precautions: "Acute GI illness and antibiotics affect oral vaccine; moderate/severe illness may warrant delay.",
      adverseEffects: "Injection soreness/fever or oral GI symptoms, headache, and rash can occur.",
      pregnancy: "Avoid live oral product; use injectable only when risk justifies.",
      immunocompromise: "Use nonlive injectable rather than live oral product.",
      nursingFocus: "Check itinerary, refrigeration, capsule timing, antibiotic interactions, and reinforce safe food/water behavior.",
      urgentEscalation: "Sustained fever with toxicity, GI bleeding, confusion, or shock after travel needs urgent evaluation.",
      pitfalls: "Do not confuse one injection with four capsules or imply vaccination makes risky food/water safe.",
      related: ["Cholera vaccine", "Hepatitis A vaccine"],
      sourceKeys: ["w38-cdc-typhoid-vaccine", "w38-cdc-vaccine-names"]
    },
    {
      name: "Vaccinia and smallpox vaccine",
      aliases: ["ACAM2000", "smallpox vaccine", "vaccinia vaccine", "percutaneous smallpox vaccine"],
      abbreviations: ["ACAM2000"],
      brands: ["ACAM2000"],
      commonMisspellings: ["small pox vaccine", "vaccina vaccine", "ACAM 2000"],
      platform: "Live replicating vaccinia virus administered by multiple puncture; distinct from nonreplicating Jynneos.",
      protectsAgainst: "Smallpox and orthopoxvirus disease in designated laboratory, military, or emergency populations.",
      mechanism: "Replicating vaccinia produces a local lesion and strong cross-reactive orthopox antibody/T-cell immunity. Continued replication at the site creates contact-transmission and autoinoculation hazards until the scab separates.",
      routineSchedule: "One percutaneous primary vaccination for designated high-risk personnel, with risk- and pathogen-specific boosters under occupational policy. No routine public vaccination.",
      catchUpMinimums: "Booster interval follows ongoing occupational risk; do not improvise a series.",
      riskBased: "Work with replication-competent orthopoxvirus, designated military role, or smallpox emergency response.",
      sharedDecisionMaking: "Because serious adverse events and household-contact risks are substantial, occupational specialists assess alternatives such as Jynneos.",
      doseCountAndSpacing: "One successful take by labeled multiple-puncture technique; booster timing is risk-specific.",
      doseVolumeSafety: "Do not interpret ACAM2000 as an IM/SC mL injection. Verify product, dilution, bifurcated needle, percutaneous technique, puncture count, site care, take assessment, and occupational protocol.",
      route: "Percutaneous multiple puncture with a bifurcated needle.",
      contraindications: "For nonemergency use: immune deficiency, pregnancy, significant eczema/skin disease, serious cardiac disease, and high-risk household contacts can contraindicate replicating vaccinia.",
      precautions: "Site containment and contact assessment are essential until the scab falls off.",
      adverseEffects: "Expected vesicle/pustule and systemic symptoms; serious risks include eczema vaccinatum, progressive vaccinia, myocarditis/pericarditis, encephalitis, ocular vaccinia, and contact transmission.",
      pregnancy: "Contraindicated in nonemergency settings because fetal vaccinia can occur.",
      immunocompromise: "Contraindicated outside an emergency; consider nonreplicating Jynneos.",
      nursingFocus: "Teach occlusive dressing/site hygiene, avoid touching, launder separately, prevent household contact, document the take, and know vaccinia immune globulin referral pathways.",
      urgentEscalation: "Chest pain, dyspnea, spreading lesions, ocular exposure, severe neurologic illness, fetal/household exposure, or failure of the lesion to heal requires immediate expert/public-health care.",
      pitfalls: "Do not confuse ACAM2000 with Jynneos, inject it, or treat the vaccination-site lesion as harmless to contacts.",
      related: ["Mpox vaccine"],
      sourceKeys: ["w38-cdc-smallpox-vaccine", "w38-cdc-vaccine-names"]
    },
    {
      name: "Yellow fever vaccine",
      aliases: ["YF-Vax", "yellow fever shot", "YF vaccine", "yellow fever travel certificate vaccine"],
      abbreviations: ["YF"],
      brands: ["YF-Vax"],
      commonMisspellings: ["yellow feaver vaccine", "yellow fever vacine", "YFVax"],
      platform: "Live attenuated 17D yellow fever virus vaccine.",
      protectsAgainst: "Mosquito-borne yellow fever, including hepatitis, hemorrhage, shock, and death, and satisfies entry requirements where an International Certificate is required.",
      mechanism: "Limited replication produces strong neutralizing antibody and T-cell memory. Durable immunity usually follows one dose, while live replication explains rare viscerotropic/neurotropic disease and immune/pregnancy restrictions.",
      routineSchedule: "One subcutaneous dose for age 9 months or older traveling to/residing in a risk area or meeting a country entry requirement, at an authorized center. The certificate becomes valid 10 days after a primary dose. Most people have lifelong protection; selected risks need a booster.",
      catchUpMinimums: "Single primary dose; booster decisions depend on destination, time, and special population rather than a universal ten-year rule.",
      riskBased: "Destination-specific transmission and entry requirements; laboratory exposure can also indicate vaccination.",
      sharedDecisionMaking: "For low-risk areas or age/pregnancy/immune concerns, compare infection risk with rare vaccine-associated neurotropic/viscerotropic harm and consider a waiver when appropriate.",
      doseCountAndSpacing: "One 0.5-mL SC dose for most; selected booster situations follow current CDC guidance.",
      doseVolumeSafety: "Reconstitute YF-Vax with its supplied diluent and give the full labeled 0.5-mL subcutaneous dose. Verify authorized center, age, destination, waiver/booster status, live-vaccine timing, route, and label.",
      route: "Subcutaneous at an authorized yellow-fever vaccination center.",
      contraindications: "Severe allergy to a component including relevant egg allergy, age younger than 6 months, severe immune deficiency/thymus disorder, and other live-vaccine contraindications.",
      precautions: "Age 6-8 months, age 60 or older, pregnancy, breastfeeding, moderate immune suppression, and asymptomatic HIV require careful risk-benefit assessment.",
      adverseEffects: "Mild fever, headache, myalgia, or local pain can occur. Rare neurotropic or viscerotropic disease can be life-threatening.",
      pregnancy: "Usually avoid unless travel risk is substantial and cannot be deferred; a waiver may be appropriate for entry-only requirements.",
      immunocompromise: "Severe immune compromise is a contraindication; assess exact degree and destination risk.",
      nursingFocus: "Check itinerary and current map/entry rules, screen thymus/immune/egg/pregnancy/breastfeeding/age risks, issue the certificate correctly, and reinforce mosquito prevention.",
      urgentEscalation: "High fever, jaundice, hypotension, organ dysfunction, encephalitis, or progressive neurologic symptoms after vaccination needs emergency evaluation and reporting.",
      pitfalls: "Do not use a blanket ten-year booster rule, vaccinate solely for paperwork when a waiver is safer, or ignore age-60 and thymus risks.",
      related: ["Japanese encephalitis vaccine", "Chikungunya vaccine", "Dengue vaccine"],
      sourceKeys: ["w38-cdc-yellow-fever-vaccine", "w38-cdc-vaccine-names"]
    }
  ];

  const asArray = (value) => Array.isArray(value) ? value : [];
  const targetIdFor = (name) => `reference:vaccination:${normalize(name).replace(/\s+/g, "-")}`;
  const allowedTargets = new Set([SCHEDULE_NAME, ...ALL_VACCINE_CARD_NAMES].map(normalize));
  const currentSeasonWarning = "Influenza and COVID-19 recommendations are season-specific. Confirm the current CDC table, product label, age indication, formulation, immune status, and prior-dose history at the time of care.";
  const intervalWarning = "A routine interval is the preferred timing; a minimum interval is the shortest interval at which a dose can count during catch-up or another allowed circumstance. A delayed valid series is continued, not restarted.";
  const administrationSafety = "Before administration, reconcile the complete immunization record and registry; verify patient identity, indication, age, pregnancy and immune status, allergies, prior reactions, product, formulation, lot, expiration, storage history, labeled dose volume, route, site, needle choice, and timing. A volume printed on one product must never be generalized to another formulation or age group.";
  const documentationSafety = "Document date, product and manufacturer, lot number, expiration when required locally, dose and units, route, anatomical site, administering clinician, funding/source when applicable, VIS or EUA information and date, consent or decision discussion, screening findings, and registry submission. Observe according to current guidance, keep an anaphylaxis response system immediately available, report clinically important adverse events through the appropriate pathway, and give the patient or caregiver an updated record and next-due date.";
  const passiveDocumentationSafety = "Document product, indication, maternal RSV vaccination history, age and weight when relevant, dose and units, route/site, manufacturer, lot, administration date, season, clinician, registry submission, caregiver education, and the next-season plan. Long-acting antibody is passive immunization, so it must not be recorded or explained as though it were an infant vaccine series.";

  const sourceDetails = (keys) => unique(keys).map((key) => {
    const source = sourceByKey.get(key);
    if (!source) return `${key} (source record unavailable)`;
    return `${source.label} — ${source.url} — effective/current status: ${source.effectiveDate}; ANI reviewed ${source.aniReviewDate}`;
  });

  const buildVaccineEntry = (spec) => {
    const isVaccine = spec.isVaccine !== false;
    const sourceKeys = unique([
      ...asArray(spec.sourceKeys),
      "w38-cdc-best-practices",
      "w38-cdc-contraindications",
      "w38-cdc-administration",
      "w38-cdc-vaccine-names"
    ]);
    const relatedTopics = unique([
      SCHEDULE_NAME,
      ...asArray(spec.related).filter((name) => allowedTargets.has(normalize(name)))
    ]);
    const aliases = unique([...asArray(spec.aliases), ...asArray(spec.brands)]);
    const searchTerms = unique([
      spec.name,
      ...aliases,
      ...asArray(spec.abbreviations),
      ...asArray(spec.commonMisspellings),
      `${spec.name} schedule`,
      `${spec.name} dose spacing`,
      `${spec.name} minimum interval`,
      `${spec.name} contraindications`,
      `${spec.name} nursing considerations`,
      `when is ${spec.name} given`,
      `why is ${spec.name} given`
    ]);
    const className = isVaccine ? "active vaccination" : "passive immunization with a long-acting monoclonal antibody";
    const definition = `${spec.name} is ${className} used to prevent ${clean(spec.protectsAgainst)} The distinction matters because active vaccination teaches the recipient's immune system to make memory, whereas passive antibody supplies protection directly and does not create the same durable immune memory.`;
    const sections = [
      { label: "Official name, aliases, brands, and abbreviations", text: `Official entry: ${spec.name}. Alternate names: ${list(aliases) || "none"}. Abbreviations: ${list(spec.abbreviations) || "none"}. Common misspellings indexed by ANI: ${list(spec.commonMisspellings) || "none"}.` },
      { label: "Classification: vaccine versus passive immunization", text: `${spec.name} is classified as ${className}. It must not be confused with a disease article, laboratory test, medication order set, or similarly named product. Product identity changes age eligibility, route, dose, spacing, contraindications, and documentation.` },
      { label: "What it prevents and why prevention matters", text: clean(spec.protectsAgainst) },
      { label: "Antigen or platform", text: clean(spec.platform) },
      { label: "Mechanism: why protection occurs", text: clean(spec.mechanism) },
      { label: "Routine schedule", text: clean(spec.routineSchedule) },
      { label: "Catch-up and minimum intervals", text: `${clean(spec.catchUpMinimums)} ${intervalWarning}` },
      { label: "Risk-based indications", text: clean(spec.riskBased) },
      { label: "Shared or individual decision-making", text: clean(spec.sharedDecisionMaking) },
      { label: "Dose count and spacing", text: `${clean(spec.doseCountAndSpacing)} Always count valid documented doses and apply the schedule for the patient's current age rather than assuming every person begins at dose one.` },
      { label: "Dose-volume safety", text: `${clean(spec.doseVolumeSafety)} Dose volume is product-, formulation-, age-, weight-, and sometimes route-specific; verify the current package labeling and CDC guidance rather than copying a number from another card.` },
      { label: "Route and administration", text: `${clean(spec.route)} ${administrationSafety}` },
      { label: "Contraindications", text: clean(spec.contraindications) },
      { label: "Precautions and deferral decisions", text: clean(spec.precautions) },
      { label: "Expected adverse effects and monitoring", text: `${clean(spec.adverseEffects)} Expected local or systemic effects should be distinguished from anaphylaxis, syncope injury, severe neurologic symptoms, or another illness that happens after immunization but is not necessarily caused by it.` },
      { label: "Pregnancy", text: clean(spec.pregnancy) },
      { label: "Immunocompromise", text: clean(spec.immunocompromise) },
      { label: "Nursing assessment and patient preparation", text: `${clean(spec.nursingFocus)} Ask what the patient has received, not merely whether vaccines are 'up to date,' because the answer must be matched to documented dates, brands, risk conditions, and the current schedule.` },
      { label: "Documentation, VIS or EUA information, registry, and reporting", text: isVaccine ? documentationSafety : passiveDocumentationSafety },
      { label: "Urgent escalation", text: clean(spec.urgentEscalation) },
      { label: "Common misconceptions and safety pitfalls", text: `${clean(spec.pitfalls)} Never infer that temporal association alone proves vaccine causation, and never let fear of a routine expected reaction obscure immediate treatment of anaphylaxis or another emergency.` },
      { label: "Related ANI topics", text: relatedTopics.join("; ") },
      { label: "Official CDC sources, effective status, and ANI review date", text: sourceDetails(sourceKeys).join(" | ") }
    ];
    return {
      name: spec.name,
      displayName: spec.name,
      type: "foundation",
      category: isVaccine ? "Preventive care / Immunization / Vaccine" : "Preventive care / Immunization / Passive antibody",
      specialty: "Preventive medicine and nursing",
      specialties: ["Preventive medicine", "Pediatrics", "Family medicine", "Internal medicine", "Obstetrics", "Nursing", "Pharmacy"],
      browseCategories: ["Vaccination", "Immunization", isVaccine ? "Vaccines" : "Passive immunization"],
      encyclopediaSection: "vaccination",
      educationalArticle: true,
      directTargetId: targetIdFor(spec.name),
      immunizationKind: isVaccine ? "vaccine" : "passive monoclonal antibody",
      definition,
      classification: className,
      diseasesPrevented: clean(spec.protectsAgainst),
      antigenPlatform: clean(spec.platform),
      mechanism: clean(spec.mechanism),
      routineSchedule: clean(spec.routineSchedule),
      catchUpMinimums: clean(spec.catchUpMinimums),
      riskBasedIndications: clean(spec.riskBased),
      sharedDecisionMaking: clean(spec.sharedDecisionMaking),
      doseCountAndSpacing: clean(spec.doseCountAndSpacing),
      doseVolumeSafety: clean(spec.doseVolumeSafety),
      route: clean(spec.route),
      contraindications: clean(spec.contraindications),
      precautions: clean(spec.precautions),
      adverseEffects: clean(spec.adverseEffects),
      pregnancy: clean(spec.pregnancy),
      immunocompromise: clean(spec.immunocompromise),
      nursingRelevance: clean(spec.nursingFocus),
      documentation: isVaccine ? documentationSafety : passiveDocumentationSafety,
      urgentEscalation: clean(spec.urgentEscalation),
      commonPitfalls: clean(spec.pitfalls),
      aliases,
      abbreviations: unique(spec.abbreviations),
      brands: unique(spec.brands),
      commonMisspellings: unique(spec.commonMisspellings),
      searchTerms,
      relatedTopics,
      crossLinks: relatedTopics.slice(),
      crossLinkRecords: relatedTopics.map((name) => ({
        label: name,
        targetName: name,
        targetId: targetIdFor(name),
        targetType: "reference"
      })),
      sourceKeys,
      sourceEffectiveDates: Object.freeze(sourceKeys.reduce((dates, key) => {
        const source = sourceByKey.get(key);
        dates[key] = source ? source.effectiveDate : "unresolved";
        return dates;
      }, {})),
      aniReviewDate: "2026-07-21",
      verificationStatus: "Primary CDC guidance reviewed; current or season-specific guidance must be rechecked when used for clinical care.",
      sourceNote: `Primary sources: ${sourceDetails(sourceKeys).join(" | ")}`,
      summary: `${definition} Routine timing: ${clean(spec.routineSchedule)} Safety: ${clean(spec.pitfalls)}`,
      quickAnswer: `${clean(spec.routineSchedule)} ${clean(spec.doseCountAndSpacing)}`,
      sections,
      tags: unique(["vaccination", "immunization", spec.name, ...asArray(spec.abbreviations), ...asArray(spec.brands), isVaccine ? "active immunity" : "passive immunity"])
    };
  };

  const vaccineEntries = vaccineSpecs.map(buildVaccineEntry);
  const vaccineEntryByName = new Map(vaccineEntries.map((entry) => [normalize(entry.name), entry]));
  const missingSpecifiedCards = ALL_VACCINE_CARD_NAMES.filter((name) => !vaccineEntryByName.has(normalize(name)));
  if (missingSpecifiedCards.length) {
    throw new Error(`Wave 38 vaccination is missing specified cards: ${missingSpecifiedCards.join(", ")}`);
  }
  if (vaccineEntries.length !== ALL_VACCINE_CARD_NAMES.length) {
    throw new Error(`Wave 38 vaccination expected ${ALL_VACCINE_CARD_NAMES.length} vaccine-type cards but built ${vaccineEntries.length}.`);
  }

  const scheduleTargetRecords = Object.freeze(timeline.flatMap((row) => row.vaccines.map((targetName) => {
    const target = vaccineEntryByName.get(normalize(targetName));
    if (!target) throw new Error(`Lifespan schedule target is unresolved: ${targetName}`);
    return Object.freeze({
      sequence: row.sequence,
      age: row.age,
      label: targetName,
      targetName: target.name,
      targetId: target.directTargetId,
      targetType: "reference"
    });
  })));
  const targetRecordsBySequence = new Map();
  scheduleTargetRecords.forEach((record) => {
    if (!targetRecordsBySequence.has(record.sequence)) targetRecordsBySequence.set(record.sequence, []);
    targetRecordsBySequence.get(record.sequence).push(record);
  });

  const scheduleSourceKeys = unique([
    "w38-cdc-child-age-current",
    "w38-cdc-child-notes-current",
    "w38-cdc-child-catchup-current",
    "w38-cdc-adult-age-current",
    "w38-cdc-adult-notes-current",
    "w38-cdc-adult-appendix-current",
    "w38-cdc-best-practices",
    "w38-cdc-contraindications",
    "w38-cdc-administration",
    "w38-cdc-vaccine-names",
    "w38-cdc-covid-current",
    "w38-cdc-rsv-infant-current",
    "w38-cdc-rsv-pregnancy-current",
    "w38-cdc-rsv-adult-current",
    "w38-cdc-pneumococcal-current",
    "w38-cdc-influenza-current"
  ]);
  const highRiskBranches = [
    "Pregnancy: Tdap during every pregnancy, seasonal inactivated influenza, current COVID guidance, and seasonal maternal Abrysvo when eligible; live MMR and varicella are postpartum rather than pregnancy vaccines.",
    "Immunocompromise or immunosuppressive therapy: avoid contraindicated live vaccines, anticipate reduced response, use additional COVID or pneumococcal guidance when indicated, and coordinate timing around therapy rather than assuming every nonlive vaccine is optimally timed.",
    "Anatomic or functional asplenia, complement deficiency, or complement-inhibitor therapy: meningococcal ACWY/B and pneumococcal protection become especially important because encapsulated organisms can cause fulminant sepsis.",
    "Hematopoietic stem-cell transplant: revaccination is often needed because prior immune memory may be lost; follow the transplant schedule rather than relying on the old record alone.",
    "Chronic kidney disease or dialysis: review HepB product/series and pneumococcal indications because immune response and invasive-infection consequences differ.",
    "Cerebrospinal-fluid leak or cochlear implant: apply current pneumococcal risk guidance because communication with normally sterile spaces raises meningitis risk.",
    "Healthcare, laboratory, military, first-responder, college/residential, correctional, shelter, occupational, or outbreak exposure: use the pathogen- and setting-specific vaccine card; these are indications, not universal additions for everyone.",
    "International travel: destination, season, itinerary, rural/urban exposure, duration, entry rules, age, pregnancy, immune status, departure date, and prior doses determine yellow fever, typhoid, Japanese encephalitis, cholera, chikungunya, rabies, polio, meningococcal, HepA, or other protection.",
    "Wound, bite, sexual, household, occupational, or other postexposure events: vaccination may be combined with wound care, immune globulin, antimicrobial treatment, testing, or public-health action; do not wait for a routine visit when timing is urgent."
  ];
  const scheduleVisuals = Object.freeze([
    Object.freeze({
      id: "vaccination-recommendation-classes",
      type: "key-value-grid",
      title: "First, identify the recommendation type",
      intro: "Routine, catch-up, risk-based, and shared-decision recommendations answer different questions. Read the badge on each age row before treating it as a universal instruction.",
      sourceField: "recommendationClasses",
      labels: Object.freeze({
        routine: "Routine",
        catchUp: "Catch-up",
        riskBased: "Risk-based",
        sharedDecisionMaking: "Shared decision"
      }),
      defaultOpen: false
    }),
    Object.freeze({
      id: "lifespan-vaccination-timeline",
      type: "timeline",
      title: "Vaccines across the lifespan",
      intro: "Scan the age, recommendation badge, and vaccine links first. Open Dose timing, exceptions, and why only when you need the full reasoning.",
      sourceField: "timeline",
      linkSourceField: "scheduleTargetRecords",
      linkJoinField: "sequence",
      mobileMode: "stacked-cards",
      labels: Object.freeze({
        navigation: "Vaccination life-stage shortcuts",
        checkpoint: "age checkpoint",
        caption: "Chronological U.S. vaccination roadmap with exact links to each vaccine card.",
        columns: Object.freeze(["Age", "Recommendation", "Vaccines and immunizations", "At this age"]),
        linkedTopics: "vaccines and immunizations",
        detailDisclosure: "Dose timing, exceptions, and why"
      }),
      fields: Object.freeze({
        rowKey: "sequence",
        title: "age",
        badge: "class",
        summary: "atThisAge",
        detail: "text",
        memoryCue: "memoryCue",
        links: "vaccines"
      }),
      groups: Object.freeze([
        Object.freeze({ id: "birth-newborn", label: "Birth and newborn period", rowKeys: Object.freeze([1, 2]), defaultOpen: true }),
        Object.freeze({ id: "infancy", label: "Infancy", rowKeys: Object.freeze([3, 4, 5, 6]), defaultOpen: false }),
        Object.freeze({ id: "toddler-school", label: "Toddler and school years", rowKeys: Object.freeze([7, 8, 9]), defaultOpen: false }),
        Object.freeze({ id: "adolescence", label: "Adolescence", rowKeys: Object.freeze([10, 11]), defaultOpen: false }),
        Object.freeze({ id: "adulthood", label: "Adulthood", rowKeys: Object.freeze([12, 13]), defaultOpen: false }),
        Object.freeze({ id: "pregnancy", label: "Pregnancy", rowKeys: Object.freeze([14]), defaultOpen: false }),
        Object.freeze({ id: "older-adulthood", label: "Age 50 and older", rowKeys: Object.freeze([15, 16, 17, 18, 19]), defaultOpen: false })
      ]),
      defaultOpen: true
    }),
    Object.freeze({
      id: "vaccination-catch-up-intervals",
      type: "responsive-table",
      title: "Catch-up spacing: minimum intervals",
      intro: "Use this table when a series is late or incomplete. A valid series usually continues; it is not restarted only because time passed.",
      sourceField: "catchUpEssentials",
      columns: Object.freeze(["Vaccine or series", "Minimum-spacing anchor"]),
      mobileMode: "stacked-cards",
      defaultOpen: false
    }),
    Object.freeze({
      id: "vaccination-special-situations",
      type: "disclosure-list",
      title: "Special situations that change the plan",
      intro: "Open the situation that applies. These branches add patient-specific guidance to the age-based roadmap.",
      sourceField: "highRiskBranches",
      visibleSafetySourceField: "urgentEscalation",
      safetyCoverageKey: "vaccination-urgent-escalation",
      defaultOpen: false
    }),
    Object.freeze({
      id: "vaccination-administration-safety",
      type: "callout",
      title: "Before any vaccine or antibody",
      sourceField: "administrationSafetySummary",
      tone: "safety",
      safetyCoverageKey: "vaccination-administration-safety",
      defaultOpen: true
    }),
    Object.freeze({
      id: "vaccination-urgent-action",
      type: "callout",
      title: "When this becomes urgent",
      sourceField: "urgentEscalation",
      tone: "urgent",
      safetyCoverageKey: "vaccination-urgent-escalation",
      defaultOpen: true
    })
  ]);
  const scheduleSections = [
    { label: "How to use this lifespan card", text: "Start at birth and move through the life-stage sections in order. Every named immunization is linked to its own detailed card. This is educational decision support, not a substitute for an order, package labeling, registry review, or patient-specific clinical judgment.", presentation: "disclosure" },
    { label: "Full administration, nursing, and current-guidance detail", text: `This master card intentionally does not give a universal vaccine volume. There is no single volume, route, formulation, or needle choice that applies across vaccines. Open the linked vaccine card and verify the exact licensed product, current label, age or weight rule, route, site, formulation, reconstitution, storage, expiration, and current CDC schedule. ${administrationSafety} ${documentationSafety} When several vaccines are due, use separate sites, map and document each site, follow current simultaneous-administration and live-vaccine spacing rules, and explain which expected effects belong to which products when possible. ${currentSeasonWarning}`, presentation: "disclosure", visibleSafetySourceField: "administrationSafetySummary", safetyCoverageKey: "vaccination-administration-safety" },
    { label: "Official CDC sources, effective status, and ANI review date", text: sourceDetails(scheduleSourceKeys).join(" | "), presentation: "disclosure", presentationRole: "sources" }
  ];
  const scheduleEntry = {
    name: SCHEDULE_NAME,
    displayName: SCHEDULE_NAME,
    type: "foundation",
    category: "Preventive care / Immunization / Lifespan schedule",
    specialty: "Preventive medicine and nursing",
    specialties: ["Preventive medicine", "Pediatrics", "Family medicine", "Internal medicine", "Obstetrics", "Geriatrics", "Nursing", "Pharmacy", "Travel medicine"],
    browseCategories: ["Vaccination", "Immunization", "Lifespan schedule", "Pediatric schedule", "Adult schedule", "Pregnancy", "Catch-up"],
    encyclopediaSection: "vaccination",
    educationalArticle: true,
    directTargetId: targetIdFor(SCHEDULE_NAME),
    definition: "A single chronological U.S. vaccination and immunization guide from birth through older adulthood, with separate routine, catch-up, risk-based, shared-decision, pregnancy, travel, occupational, and postexposure branches and direct links to forty dedicated vaccine or passive-immunization cards.",
    mechanism: "Vaccination schedules place doses when exposure risk, immune-system maturation, antibody transfer, waning protection, disease severity, product licensing, and evidence of immune response create the best benefit. Spacing is not arbitrary: early doses prime immunity, later doses strengthen and mature memory, and minimum intervals prevent compressed schedules from being counted when the immune response may be inadequate.",
    whyItMatters: "This schedule matters because protection depends on giving the right product to the right person at a valid age and interval. A missed indicated dose can leave preventable risk, while an early dose or an unrecognized pregnancy, immune, exposure, or product issue can make a plan invalid or unsafe. The roadmap shows what is usually due first, then separates catch-up and patient-specific exceptions.",
    quickAnswer: "Start with birth HepB and eligible infant RSV antibody, continue the pediatric primary series and school/adolescent vaccines, then follow annual/current-season, catch-up, pregnancy, risk-based, and older-adult recommendations. Open each linked card for exact products, doses, spacing, route, contraindications, and nursing guidance.",
    summary: `This lifespan vaccination card progresses from birth through age 75 and older. Use the age-based roadmap first, then check the immunization record, minimum intervals, product, pregnancy, immune status, travel, exposure, and other risk-based branches. ${intervalWarning}`,
    aliases: unique(["vaccination schedule", "immunization schedule", "vaccine timeline", "shots by age", "baby shots", "2 month shots", "well-child vaccines", "pediatric vaccine mnemonic", "Be DR HIP", "DR HIP", "Very MAD HIP-ster", "Very DIM", "adult shots", "vaccines at 50", "vaccines over 65", "pregnancy vaccines", "catch-up shots", "lifespan immunization schedule"]),
    abbreviations: ["U.S. vaccine schedule"],
    commonMisspellings: ["vaccination schedual", "immunization schedual", "pediatric vacination schedule", "vaccine calender", "vaccinne timeline"],
    searchTerms: unique(["what shots does my baby need", "vaccines from birth to old age", "how far apart are vaccines", "missed childhood vaccines", "which vaccines are due", "vaccines during pregnancy", "senior vaccines", "adult immunization schedule", "pediatric vaccination schedule", "pediatric vaccination mnemonic", "2 Be DR HIP", "Be DR HIP IN 6", "Very DIM between 4-6"]),
    recommendationClasses: { ...recommendationClasses },
    catchUpEssentials: catchUpEssentials.slice(),
    timeline: timeline.map((row) => ({ ...row, vaccines: row.vaccines.slice() })),
    highRiskBranches: highRiskBranches.slice(),
    scheduleTargetRecords: scheduleTargetRecords.slice(),
    administrationSafetySummary: "Before giving any vaccine or preventive antibody, verify the exact product, current label and schedule, age or weight, dose volume, route, site, formulation, storage, expiration, prior doses, allergies, pregnancy, and immune status. Keep epinephrine and an emergency-response plan immediately available. Recheck current seasonal guidance for influenza, COVID-19, RSV, and pneumococcal products.",
    visuals: scheduleVisuals.slice(),
    presentation: {
      schemaVersion: "ani-card-presentation-v1",
      maximumInitiallyVisibleSections: 7,
      maximumInitiallyVisibleWords: 650
    },
    relatedTopics: ALL_VACCINE_CARD_NAMES.slice(),
    crossLinks: ALL_VACCINE_CARD_NAMES.slice(),
    crossLinkRecords: ALL_VACCINE_CARD_NAMES.map((name) => ({ label: name, targetName: name, targetId: targetIdFor(name), targetType: "reference" })),
    nursingRelevance: "Reconcile records and registry data, screen contraindications and precautions, distinguish routine from risk-based and shared decisions, calculate valid spacing, verify the exact product/volume/route, obtain and document consent and education, administer safely, prepare for anaphylaxis, report indicated events, and communicate the next due date.",
    doseVolumeSafety: "No universal dose volume is stated on this master card. Each dedicated vaccine or antibody card binds administration information to the relevant product, formulation, age, weight, route, and official source.",
    urgentEscalation: "Treat suspected anaphylaxis immediately according to emergency protocol. Also escalate severe respiratory, cardiovascular, neurologic, hemorrhagic, or systemic symptoms; serious administration errors; pregnancy exposure to a contraindicated live vaccine; or a time-sensitive postexposure situation that requires immune globulin, public-health action, or additional prophylaxis.",
    documentation: documentationSafety,
    sourceKeys: scheduleSourceKeys,
    sourceEffectiveDates: Object.freeze(scheduleSourceKeys.reduce((dates, key) => {
      dates[key] = sourceByKey.get(key).effectiveDate;
      return dates;
    }, {})),
    aniReviewDate: "2026-07-21",
    verificationStatus: "Primary CDC schedule and product-specific guidance reviewed. Seasonal and rapidly changing recommendations are explicitly labeled for point-of-care recheck.",
    sourceNote: `Primary CDC sources: ${sourceDetails(scheduleSourceKeys).join(" | ")}`,
    sections: scheduleSections,
    tags: ["vaccination schedule", "immunization schedule", "pediatric vaccines", "adult vaccines", "pregnancy vaccines", "catch-up", "risk-based immunization", "shared decision-making", "nursing"]
  };

  const entries = [scheduleEntry, ...vaccineEntries];
  const legacyPharmDuplicateRecords = [];
  const legacyPharmDrugs = window.ANI_PHARM_DATABASE && Array.isArray(window.ANI_PHARM_DATABASE.drugs)
    ? window.ANI_PHARM_DATABASE.drugs
    : [];
  const vaccineTargetByName = new Map(vaccineEntries.map((entry) => [normalize(entry.name), entry]));
  legacyPharmDrugs.forEach((drug) => {
    const key = normalize(drug && (drug.name || drug.generic || drug.displayName));
    const replacement = vaccineTargetByName.get(key);
    if (!replacement || !drug || typeof drug !== "object") return;
    drug.aniSearchSuppressed = true;
    drug.aniSearchSuppressionReason = "Superseded by the richer Wave 38 vaccination reference card with the same canonical name.";
    drug.supersededByReferenceName = replacement.name;
    drug.supersededByDirectTargetId = replacement.directTargetId;
    legacyPharmDuplicateRecords.push(Object.freeze({
      legacyType: "drug",
      legacyName: clean(drug.name || drug.generic || drug.displayName),
      canonicalName: replacement.name,
      replacementType: "reference",
      replacementTargetId: replacement.directTargetId,
      policy: "suppress-legacy-pharm-search-result"
    }));
  });
  const mergeEntry = (existing, incoming) => {
    const merged = { ...(existing || {}), ...incoming };
    ["aliases", "abbreviations", "brands", "commonMisspellings", "searchTerms", "relatedTopics", "crossLinks", "tags", "sourceKeys", "specialties", "browseCategories"].forEach((field) => {
      merged[field] = unique([...asArray(existing && existing[field]), ...asArray(incoming[field])]);
    });
    merged.educationalArticle = true;
    merged.sections = incoming.sections.map((section) => ({ ...section }));
    return merged;
  };
  const existingIndex = new Map(database.entries.map((entry, index) => [normalize(entry && entry.name), index]).filter(([key]) => key));
  let inserted = 0;
  let improved = 0;
  entries.forEach((entry) => {
    const key = normalize(entry.name);
    const index = existingIndex.get(key);
    if (Number.isInteger(index)) {
      database.entries[index] = mergeEntry(database.entries[index], entry);
      improved += 1;
    } else {
      existingIndex.set(key, database.entries.length);
      database.entries.push(entry);
      inserted += 1;
    }
  });

  const alphabeticalIndexMutable = entries.reduce((index, entry) => {
    const letter = entry.name.charAt(0).toUpperCase();
    if (!index[letter]) index[letter] = [];
    index[letter].push(entry.name);
    return index;
  }, {});
  Object.values(alphabeticalIndexMutable).forEach((names) => names.sort((left, right) => left.localeCompare(right)));
  const synonymIndexMutable = {};
  entries.forEach((entry) => {
    unique([entry.name, ...asArray(entry.aliases), ...asArray(entry.abbreviations), ...asArray(entry.brands), ...asArray(entry.commonMisspellings)]).forEach((term) => {
      const key = normalize(term);
      if (!synonymIndexMutable[key]) synonymIndexMutable[key] = [];
      if (!synonymIndexMutable[key].includes(entry.name)) synonymIndexMutable[key].push(entry.name);
    });
  });
  const directTargetIndex = Object.freeze(entries.reduce((index, entry) => {
    index[entry.directTargetId] = entry.name;
    return index;
  }, {}));
  const exactNameTargetIndex = Object.freeze(entries.reduce((index, entry) => {
    index[normalize(entry.name)] = Object.freeze({ targetName: entry.name, targetId: entry.directTargetId, targetType: "reference" });
    return index;
  }, {}));

  database.cohorts = { ...(database.cohorts || {}), wave38Vaccination: entries.map((entry) => entry.name) };
  database.componentVersions = { ...(database.componentVersions || {}), wave38Vaccination: VERSION };
  database.latestExtensionVersion = VERSION;
  window.ANI_FOUNDATIONS_DATABASE = database;
  window[GLOBAL_NAME] = Object.freeze({
    schemaVersion: 1,
    version: VERSION,
    applied: true,
    scheduleName: SCHEDULE_NAME,
    scheduleEntry,
    entries: Object.freeze(entries.slice()),
    entryNames: Object.freeze(entries.map((entry) => entry.name)),
    entryCount: entries.length,
    vaccineCardCount: vaccineEntries.length,
    inserted,
    improved,
    chronologicalRowCount: timeline.length,
    scheduleTargetCount: scheduleTargetRecords.length,
    scheduleTargetRecords,
    directTargetIndex,
    exactNameTargetIndex,
    legacyPharmDuplicateCount: legacyPharmDuplicateRecords.length,
    legacyPharmDuplicateRecords: Object.freeze(legacyPharmDuplicateRecords.slice()),
    alphabeticalIndex: Object.freeze(alphabeticalIndexMutable),
    synonymIndex: Object.freeze(synonymIndexMutable),
    sourceKeys: Object.freeze(unique(entries.flatMap((entry) => entry.sourceKeys))),
    aniReviewDate: "2026-07-21"
  });
}());
