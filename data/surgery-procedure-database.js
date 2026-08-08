(function installAniSurgeryProcedureDatabase(root, factory) {
  "use strict";
  const database = factory(root);
  if (root && typeof root === "object") root.ANI_SURGERY_PROCEDURE_DATABASE = database;
  if (typeof module !== "undefined" && module.exports) module.exports = database;
})(typeof globalThis !== "undefined" ? globalThis : this, function buildDatabase(root) {
  "use strict";
  const core = (root && root.AniSurgeryProceduresDomainCore) || (typeof require === "function" ? require("../src/surgery-procedures/domain-core") : null);
  if (!core || typeof core.architectureDefinition !== "function") throw new Error("ANI Surgeries & Procedures domain core must load before surgery-procedure-database.js");
  if (core.ARCHITECTURE_VERSION !== "ani-surgery-procedures-domain-v1") throw new Error("ANI Surgeries & Procedures architecture version drift");
  const architectureSha256 = "a854e7fd3dfb36c399a19f7089fafce8ee6a7822400946b0f5b302d2c14d0111";
  const entries = [
      {
        "abbreviations": [
          "CABG"
        ],
        "aliases": [
          "CABG",
          "coronary bypass",
          "heart bypass surgery",
          "coronary artery bypass surgery",
          "cabbage",
          "coronary artery bypass graphing"
        ],
        "browse": {
          "branchId": "cardiovascular-vascular",
          "branchIds": [
            "cardiovascular-vascular",
            "perioperative-care"
          ],
          "label": "Cardiovascular and Vascular Procedures"
        },
        "category": "Surgeries & Procedures / Cardiovascular and Vascular Procedures",
        "commonMisspellings": [
          "coronary artery bypass graphing"
        ],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Coronary artery disease",
            "id": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting:link:1",
            "label": "Coronary artery disease",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "displayName": "Coronary artery bypass grafting (CABG)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Coronary artery bypass grafting",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "name": "Coronary artery bypass grafting",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "cardiovascular-vascular",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 1,
          "primaryBranchId": "cardiovascular-vascular",
          "safetyVisibleSectionIds": [
            "consent-and-nursing-responsibility",
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Coronary artery bypass grafting (CABG) is an open cardiac operation that uses a healthy vessel graft to route blood around one or more severely narrowed coronary arteries. It is therapeutic revascularization, not a diagnostic catheter test; urgency depends on the coronary syndrome and anatomy.",
        "relatedTopics": [
          "Coronary artery disease"
        ],
        "searchTerms": [
          "blocked heart arteries surgery",
          "cabbage",
          "CABG",
          "Coronary artery bypass grafting",
          "Coronary artery bypass grafting (CABG)",
          "coronary artery bypass graphing",
          "coronary artery bypass surgery",
          "coronary bypass",
          "heart bypass surgery",
          "internal thoracic artery graft",
          "post CABG nursing care",
          "saphenous vein graft",
          "sternotomy bypass"
        ],
        "sections": [
          {
            "content": "The coronary arteries supply oxygen to heart muscle. A graft such as the internal thoracic artery, radial artery, or a segment of saphenous vein is connected so blood can travel around an obstruction; a sternotomy and cardiopulmonary bypass may be used, but technique varies.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": [
              "Selected left-main or multivessel coronary artery disease when surgery offers an appropriate revascularization strategy.",
              "Persistent ischemia or acute coronary instability when anatomy, symptoms, ventricular function, comorbidities, and the heart-team plan favor CABG over PCI or medical therapy.",
              "The operation improves blood delivery but does not cure atherosclerosis, so secondary prevention remains essential."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Under general anesthesia the surgical team obtains a graft conduit, connects it beyond the blocked coronary segment, confirms flow, and closes the operative sites. The patient commonly goes to a cardiac ICU with airway, hemodynamic, drainage, pacing, and urine-output monitoring; this overview intentionally omits operative-manual detail.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Trend chest pain, vital signs, rhythm, heart and lung findings, peripheral perfusion, neurologic baseline, renal function, glucose, blood count, coagulation results, and blood-product readiness. Reconcile antiplatelets, anticoagulants, diabetes drugs, supplements, allergies, prior anesthesia problems, and graft-site circulation. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Explain the individualized fasting and medication plan, expected ICU recovery, temporary ventilator support, chest tubes, lines, urinary catheter, possible pacing wires, pain control, coughing and deep breathing with incision support, incentive spirometry, and progressive mobility. Clarify that incision and graft-harvest sites both require observation.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "The surgeon is responsible for explaining benefits, material risks, alternatives such as PCI or medical management, and the planned approach. The nurse verifies identity, procedure/site, signed consent before impairing sedation unless a recognized emergency applies, capacity, voluntary agreement, interpreter access, allergies, and that unanswered questions return to the procedural clinician.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Prioritize airway and ventilation, oxygenation, arterial pressure and perfusion, rhythm, neurologic status, temperature, glucose, urine output, and pain. Trend chest-tube output and hemodynamics together because hemorrhage or tamponade may appear as falling pressure, rising filling pressures, poor urine output, cool skin, or abrupt drainage change.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": [
              "An endotracheal tube and ventilator may remain until the patient meets extubation criteria.",
              "Arterial and central access support continuous pressure monitoring, blood sampling, vasoactive therapy, and fluid assessment.",
              "Mediastinal or pleural tubes drain blood and air; temporary pacing wires permit treatment of selected postoperative rhythm problems.",
              "A urinary catheter tracks renal perfusion, and graft-harvest incisions require distal circulation and wound checks."
            ],
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Incisional pain, fatigue, temporary ventilator dependence, modest serosanguineous drain output, and temporary vasoactive or pacing support may occur. Expected recovery is judged by stable trends, improving ventilation, adequate perfusion and urine output, intact neurologic status, and drainage within the surgeon's ordered parameters—not by one universal number.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage, cardiac tamponade, graft ischemia or myocardial infarction, dysrhythmia, stroke, low cardiac output, respiratory failure, acute kidney injury, infection, and glucose or electrolyte instability."
              ],
              "later": [
                "Sternal or graft-site infection, venous thromboembolism, deconditioning, recurrent angina, graft failure, and progression of atherosclerosis."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": [
              {
                "action": "Call the cardiac surgery team immediately, maintain ABC support, verify drains are not kinked without stripping them, obtain ordered hemodynamic and laboratory data, and activate emergency response for instability.",
                "finding": "Hypotension, rising filling pressures, poor urine output, muffled heart sounds, or sudden high or abruptly stopped chest-tube drainage",
                "why": "These findings can signal hemorrhage or tamponade, where delayed decompression or blood replacement can be fatal."
              },
              {
                "action": "Start emergency cardiac or stroke evaluation while supporting oxygenation and circulation.",
                "finding": "New ST change, severe chest pain, ventricular dysrhythmia, unilateral weakness, or acute confusion",
                "why": "Graft occlusion, myocardial ischemia, or embolic stroke requires time-sensitive treatment."
              },
              {
                "action": "Escalate immediately and support ventilation while checking tubes and obtaining urgent assessment.",
                "finding": "New severe dyspnea, absent breath sounds, or inability to oxygenate",
                "why": "Pneumothorax, hemothorax, atelectasis, pulmonary edema, or tube malfunction may rapidly impair gas exchange."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Use head elevation and turning as hemodynamics allow, protect lines and drains, support the sternum for coughing, and begin assisted mobility per the postoperative pathway. Sternal precautions vary by surgeon and stability; teach the ordered movement and lifting plan rather than a universal restriction.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Advance intake after extubation and swallowing safety according to the team plan. Trend glucose, nausea, bowel function, fluid balance, and hourly urine output because stress hyperglycemia, ileus, and low renal perfusion can worsen outcomes.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia and reassess sedation, breathing, cough, mobility, and hemodynamics. Distinguish expected incisional pain from new pressure-like ischemic pain, pain with instability, or rapidly increasing pain at a graft site.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "Teach incision and graft-site care, fever or drainage warnings, daily activity progression, the individualized lifting/driving plan, pulmonary exercises, cardiac rehabilitation, heart-healthy risk reduction, and medication adherence. Never stop an antiplatelet or other cardiac medicine without the prescribing clinician's direction; call emergency services for recurrent ischemic symptoms or stroke signs.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": "No single validated CABG mnemonic replaces the ordered cardiac-surgery pathway; use an ABC, bleeding/tamponade, rhythm, perfusion, neurologic, renal, pulmonary, and wound sequence.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": [
              "A patent graft can restore oxygen delivery, but low pressure or thrombosis can threaten the myocardium quickly.",
              "Chest-tube trends matter because both excessive drainage and abrupt cessation with instability can indicate danger.",
              "Rhythm and electrolyte monitoring matter because postoperative atrial and ventricular dysrhythmias can reduce cardiac output.",
              "Pulmonary hygiene and early mobility reduce atelectasis, pneumonia, venous stasis, and functional decline."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          },
          {
            "content": {
              "commonMisconception": "CABG bypasses lesions but does not cure coronary atherosclerosis.",
              "immediateActionFinding": "Hypotension with poor output or abrupt drainage change.",
              "mostImportantComplication": "Hemorrhage or tamponade with low cardiac output.",
              "patientTeaching": "Cardiac rehabilitation, wound care, risk reduction, and prescribed medication adherence.",
              "positioningPrecaution": "Position for ventilation while protecting hemodynamics, sternum, tubes, and graft sites.",
              "priorityAssessment": "Airway, hemodynamics, rhythm, perfusion, and chest-tube trend."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-cabg"
            ]
          }
        ],
        "sourceKeys": [
          "aha-revascularization",
          "nlm-cabg"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM patient education and the ACC/AHA/SCAI revascularization guideline; approach, tubes, thresholds, and recovery instructions remain patient- and program-specific.",
        "studentFacing": true,
        "summary": "Coronary artery bypass grafting (CABG) is an open cardiac operation that uses a healthy vessel graft to route blood around one or more severely narrowed coronary arteries. It is therapeutic revascularization, not a diagnostic catheter test; urgency depends on the coronary syndrome and anatomy.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "5ccd38d7dae7e5d5be2bc6d730c566b951d807149a8970bc35b4df3d29de9d1d",
          "stableId": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "CABG"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "coronary bypass"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "heart bypass surgery"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "coronary artery bypass surgery"
          },
          {
            "identity": true,
            "kind": "phonetic",
            "value": "cabbage"
          },
          {
            "identity": true,
            "kind": "common-misspelling",
            "value": "coronary artery bypass graphing"
          }
        ],
        "whyItMatters": "A patent graft can restore oxygen delivery, but low pressure or thrombosis can threaten the myocardium quickly. Chest-tube trends matter because both excessive drainage and abrupt cessation with instability can indicate danger. Rhythm and electrolyte monitoring matter because postoperative atrial and ventricular dysrhythmias can reduce cardiac output. Pulmonary hygiene and early mobility reduce atelectasis, pneumonia, venous stasis, and functional decline."
      },
      {
        "abbreviations": [
          "PCI"
        ],
        "aliases": [
          "PCI",
          "percutaneous coronary intervention",
          "coronary angioplasty",
          "heart stent",
          "coronary stent placement",
          "angioplasty and stent"
        ],
        "browse": {
          "branchId": "cardiovascular-vascular",
          "branchIds": [
            "cardiovascular-vascular",
            "perioperative-care"
          ],
          "label": "Cardiovascular and Vascular Procedures"
        },
        "category": "Surgeries & Procedures / Cardiovascular and Vascular Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Coronary artery disease",
            "id": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent:link:1",
            "label": "Coronary artery disease",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "displayName": "Percutaneous coronary intervention with coronary stent (PCI)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Percutaneous coronary intervention with coronary stent",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "name": "Percutaneous coronary intervention with coronary stent",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "cardiovascular-vascular",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "percutaneous",
              "catheter-based",
              "minimally-invasive"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 2,
          "primaryBranchId": "cardiovascular-vascular",
          "safetyVisibleSectionIds": [
            "consent-and-nursing-responsibility",
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "PCI is a minimally invasive catheter-based procedure that crosses a narrowed or blocked coronary artery, inflates a balloon when indicated, and usually leaves a mesh stent to keep the vessel open. It can be planned for selected ischemia or performed urgently during an acute coronary event; it is not open-heart surgery.",
        "relatedTopics": [
          "Coronary artery disease"
        ],
        "searchTerms": [
          "angioplasty and stent",
          "blocked artery balloon",
          "cardiac stent",
          "cath lab stent",
          "coronary angioplasty",
          "coronary stent placement",
          "femoral access",
          "heart stent",
          "PCI",
          "percutaneous coronary intervention",
          "Percutaneous coronary intervention with coronary stent",
          "Percutaneous coronary intervention with coronary stent (PCI)",
          "post PCI nursing care",
          "radial access"
        ],
        "sections": [
          {
            "content": "A catheter enters an artery, commonly at the wrist or groin, and is guided to the coronary arteries. Contrast outlines the lesion; a balloon expands the narrowed segment and a coronary stent supports the lumen so blood can reach myocardium.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": [
              "Restore coronary blood flow during selected acute myocardial infarction or unstable ischemia.",
              "Relieve angina or objective ischemia from a suitable coronary stenosis when the clinical and anatomic plan favors PCI.",
              "Not every lesion needs PCI; medical therapy or CABG may be safer depending on anatomy and patient factors."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "With local anesthesia and sedation as ordered, an interventional cardiologist advances a catheter under imaging, gives contrast, crosses the lesion, expands it, and deploys a stent when appropriate. The sheath or closure device is managed by protocol, and the patient recovers with rhythm, perfusion, access-site, and contrast-related monitoring.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Assess ischemic symptoms, vital signs, rhythm, kidney function, hydration risk, contrast reaction history, bleeding risk, blood count, coagulation status, pregnancy possibility when relevant, baseline radial or pedal pulses, and current antiplatelet, anticoagulant, diabetes, and nephrotoxic medicines. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Explain the individualized fasting and medicine plan, that the patient may be awake with sedation, possible warmth from contrast, need to keep the access limb positioned as directed, and postprocedure pulse and puncture-site checks. Stress that prescribed antiplatelet therapy after stenting protects against stent thrombosis.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "The interventional clinician explains indication, bleeding and vascular risks, contrast and kidney risks, restenosis or thrombosis, alternatives, and possible emergency surgery. The nurse verifies consent before impairing sedation, identity, allergies, baseline access-site circulation, interpreter needs, and that questions return to the procedural clinician.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Trend chest pain, ECG/rhythm, pressure, oxygenation, access-site bleeding or swelling, distal pulse/color/warmth/sensation, and neurologic status. Maintain ordered radial or femoral precautions, monitor urine output and renal risk after contrast, and verify the antiplatelet plan.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": [
              "A radial or femoral arterial sheath may remain briefly or a closure device may be used; site management follows device and facility protocol.",
              "The coronary stent remains implanted and requires adherence to the prescribed antiplatelet strategy.",
              "Continuous ECG and blood-pressure monitoring detect recurrent ischemia, dysrhythmia, or bleeding-related instability."
            ],
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Mild puncture-site tenderness or a small stable bruise may occur, but the site should not expand, distal circulation should remain intact, and ischemic symptoms should improve. Bedrest, ambulation, and discharge timing depend on access route, closure method, urgency, bleeding risk, kidney function, and local protocol.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": {
              "early": [
                "Acute stent thrombosis or vessel closure, recurrent myocardial ischemia, dysrhythmia, bleeding, retroperitoneal hemorrhage after femoral access, radial occlusion, pseudoaneurysm, embolic stroke, contrast reaction, and acute kidney injury."
              ],
              "later": [
                "In-stent restenosis, late stent thrombosis, recurrent angina, and progression of coronary atherosclerosis."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": [
              {
                "action": "Activate the acute coronary response, obtain immediate ECG and vital assessment, maintain ABC support, and notify the interventional team without delay.",
                "finding": "New chest pressure, ST change, ventricular dysrhythmia, shock, or sudden dyspnea",
                "why": "Acute stent thrombosis, coronary dissection, infarction, or arrhythmia can rapidly destroy myocardium."
              },
              {
                "action": "Apply protocol-directed site pressure, call for immediate help, support circulation, and evaluate for concealed hemorrhage.",
                "finding": "Expanding groin or wrist swelling, uncontrolled bleeding, hypotension, back or flank pain, or falling hemoglobin",
                "why": "Arterial bleeding may be external or retroperitoneal and can progress to shock."
              },
              {
                "action": "Escalate immediately and protect the limb while urgent vascular assessment is arranged.",
                "finding": "Cool, pale, numb, painful limb or absent distal pulse",
                "why": "Access-related arterial obstruction threatens tissue perfusion."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Keep the access extremity in the ordered position and avoid unsupported flexion or pressure at the site. Mobilize only when sheath/closure, hemostasis, sedation recovery, and local protocol permit; radial and femoral restrictions are not interchangeable.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Resume fluids and food when swallowing, nausea, and the care plan permit. Monitor intake, urine output, creatinine risk, and glucose; hydration instructions must be individualized for kidney and heart function.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Treat mild access-site discomfort as ordered while repeatedly checking the site and distal circulation. Chest pressure, severe back/flank pain, rapidly increasing site pain, or pain with a pulse change is not routine postoperative soreness.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "Teach puncture-site care, activity restrictions specific to access and closure, hydration plan, follow-up, cardiac rehabilitation when ordered, and emergency response for chest pain, bleeding that will not stop, stroke signs, or a cold painful limb. Take antiplatelet medicines exactly as prescribed and never stop them without the prescribing cardiology team.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": "No named PCI mnemonic replaces a structured post-catheter check: ischemia and rhythm, bleeding, distal circulation, contrast/kidney risk, and antiplatelet continuity.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": [
              "Recurrent chest pain after PCI can mean acute vessel closure rather than expected recovery.",
              "Access-site checks protect against visible and concealed arterial hemorrhage.",
              "Distal neurovascular checks detect limb-threatening obstruction early.",
              "Antiplatelet adherence matters because a clot inside a new stent can abruptly stop coronary flow."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          },
          {
            "content": {
              "commonMisconception": "PCI opens a lesion but does not cure coronary atherosclerosis.",
              "immediateActionFinding": "New chest pain, hypotension, expanding hematoma, or pulse loss.",
              "mostImportantComplication": "Acute stent thrombosis or major arterial bleeding.",
              "patientTeaching": "Do not interrupt prescribed antiplatelet therapy without cardiology direction.",
              "positioningPrecaution": "Follow the route-specific radial or femoral restriction.",
              "priorityAssessment": "Chest pain/ECG plus access-site and distal perfusion checks."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "aha-revascularization",
              "nlm-pci"
            ]
          }
        ],
        "sourceKeys": [
          "aha-revascularization",
          "nlm-pci"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM PCI education and the ACC/AHA/SCAI revascularization guideline; antiplatelet duration, access precautions, and discharge timing require the current cardiology plan.",
        "studentFacing": true,
        "summary": "PCI is a minimally invasive catheter-based procedure that crosses a narrowed or blocked coronary artery, inflates a balloon when indicated, and usually leaves a mesh stent to keep the vessel open. It can be planned for selected ischemia or performed urgently during an acute coronary event; it is not open-heart surgery.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "b347dd89c54255cb97ea84096b21d23e011388ae2d0367aea3c96ca5ac17d455",
          "stableId": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "PCI"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "percutaneous coronary intervention"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "coronary angioplasty"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "heart stent"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "coronary stent placement"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "angioplasty and stent"
          }
        ],
        "whyItMatters": "Recurrent chest pain after PCI can mean acute vessel closure rather than expected recovery. Access-site checks protect against visible and concealed arterial hemorrhage. Distal neurovascular checks detect limb-threatening obstruction early. Antiplatelet adherence matters because a clot inside a new stent can abruptly stop coronary flow."
      },
      {
        "abbreviations": [
          "lap chole"
        ],
        "aliases": [
          "gallbladder removal",
          "laparoscopic cholecystectomy",
          "lap chole",
          "open cholecystectomy",
          "cholecystectemy"
        ],
        "browse": {
          "branchId": "gastrointestinal-general",
          "branchIds": [
            "gastrointestinal-general",
            "perioperative-care"
          ],
          "label": "Gastrointestinal and General Surgery"
        },
        "category": "Surgeries & Procedures / Gastrointestinal and General Surgery",
        "commonMisspellings": [
          "cholecystectemy"
        ],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Cholecystitis",
            "id": "surgery-procedure:gastrointestinal-general:cholecystectomy:link:1",
            "label": "Cholecystitis",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:cholecystectomy",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "Cholelithiasis",
            "id": "surgery-procedure:gastrointestinal-general:cholecystectomy:link:2",
            "label": "Cholelithiasis",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:cholecystectomy",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "displayName": "Cholecystectomy (gallbladder removal)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Cholecystectomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "name": "Cholecystectomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "gastrointestinal-general",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "laparoscopic",
              "robotic",
              "open"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 3,
          "primaryBranchId": "gastrointestinal-general",
          "safetyVisibleSectionIds": [],
          "supplementalRequested": false
        },
        "quickAnswer": "Cholecystectomy removes the gallbladder, most often through small laparoscopic or robotic incisions and sometimes through an open incision. It treats symptomatic or complicated gallbladder disease; conversion from minimally invasive to open surgery is a safety decision, not a failure.",
        "relatedTopics": [
          "Cholecystitis",
          "Cholelithiasis"
        ],
        "searchTerms": [
          "bile duct injury",
          "cholecystectemy",
          "Cholecystectomy",
          "Cholecystectomy (gallbladder removal)",
          "gallbladder removal",
          "gallstone surgery",
          "lap chole",
          "laparoscopic cholecystectomy",
          "open cholecystectomy",
          "post chole nursing care",
          "remove gallbladder"
        ],
        "sections": [
          {
            "content": "The gallbladder stores bile beneath the liver and connects through the cystic duct to the biliary tree. The operation separates and removes the gallbladder while protecting the common bile duct, hepatic vessels, liver, bowel, and nearby structures.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": [
              "Symptomatic gallstones, recurrent biliary pain, or gallbladder inflammation.",
              "Complications such as infection, gangrene, perforation, or selected biliary-pancreatic problems when the surgical team determines removal is indicated.",
              "The urgency depends on infection, obstruction, organ dysfunction, and overall stability."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Under general anesthesia, instruments enter through small abdominal ports for laparoscopic or robotic surgery; the gallbladder is separated from its duct and blood supply and removed. Imaging of the bile ducts or an open incision may be needed, and a drain is used only in selected cases.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Assess pain location, fever, jaundice, nausea/vomiting, hydration, abdominal findings, infection or sepsis cues, pregnancy possibility, liver chemistries, bilirubin, blood count, coagulation, renal function, allergies, and prior abdominal surgery. Reconcile anticoagulants, diabetes drugs, and supplements. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Review individualized fasting and medicines, general anesthesia, small incisions with possible open conversion, early walking, breathing exercises, pain and nausea control, and that shoulder discomfort can occur after laparoscopic gas. Explain that worsening abdominal pain, jaundice, fever, or persistent vomiting is not routine.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "The surgeon explains the approach, possible conversion to open surgery, bleeding, infection, bile leak or duct injury, retained stones, and alternatives. The nurse verifies consent before sedating medicine, identity, allergies, pregnancy status when relevant, interpreter access, and escalation of unanswered questions to the surgeon.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Assess airway, breathing after anesthesia, circulation, pain, nausea, abdominal distention, incisions, drain output if present, temperature, urine output, and ability to tolerate intake and move. Compare pain and vital trends rather than labeling severe or increasing pain as expected.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "An IV is routine; a urinary catheter may be temporary for selected patients. A surgical drain is not universal, but when present its amount, color, patency, and surrounding skin are trended because bilious output may indicate a leak.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Incisional soreness, fatigue, mild nausea, and temporary shoulder-tip discomfort after laparoscopy may occur and should improve. Stable vital signs, manageable pain, clean incisions, progressive mobility, and improving oral intake support recovery; open procedures usually require a different recovery course.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": {
              "early": [
                "Bleeding, respiratory compromise, surgical-site infection, bile leak, common bile duct injury, retained duct stone, pancreatitis, bowel or vascular injury, and venous thromboembolism."
              ],
              "later": [
                "Bile-duct stricture, incisional hernia, persistent digestive symptoms, or retained/recurrent duct stones."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": [
              {
                "action": "Escalate urgently, maintain ABC support, keep oral intake per the team plan, and prepare for laboratory and imaging evaluation.",
                "finding": "Increasing right-upper abdominal pain with tachycardia, hypotension, rigidity, or falling hemoglobin",
                "why": "Internal bleeding or visceral injury can progress to shock or peritonitis."
              },
              {
                "action": "Notify the surgical team promptly and assess for sepsis, dehydration, and obstruction while obtaining ordered tests.",
                "finding": "Fever, jaundice, worsening abdominal pain, persistent vomiting, or bilious drain output",
                "why": "Bile leak, duct injury, retained stone, or infection needs early recognition."
              },
              {
                "action": "Activate urgent cardiopulmonary assessment.",
                "finding": "New dyspnea, chest pain, or unilateral leg swelling",
                "why": "Postoperative venous thromboembolism can be life-threatening."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Elevate the head as tolerated, reposition, support incisions during coughing, and promote early walking. Follow the surgeon's lifting and wound plan; activity progression differs after laparoscopic and open surgery.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "disclosure",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Advance fluids and food according to nausea, swallowing, bowel function, and the surgical plan rather than a universal bowel-sound rule. Smaller, lower-fat meals may be easier early in recovery; monitor hydration, urine, gas/stool, distention, and persistent vomiting.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia, splinting, repositioning, and early mobility, then reassess breathing and function. Shoulder discomfort may follow laparoscopy, but severe, localized, escalating, or peritoneal pain requires reassessment.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "Teach incision or drain care, gradual activity, the individualized diet, medication use, and follow-up. Seek prompt care for fever, jaundice, increasing pain or distention, repeated vomiting, inability to hydrate, wound drainage, dyspnea, chest pain, or leg swelling.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": "No validated cholecystectomy mnemonic replaces procedure-specific surveillance for airway recovery, bleeding, bile leak or duct injury, infection, intake, and mobility.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": [
              "Jaundice or bilious drainage after surgery can point to a bile-duct problem rather than routine healing.",
              "Early walking and lung expansion reduce venous stasis and atelectasis after anesthesia.",
              "Severe or worsening abdominal pain matters because bleeding, leak, or bowel injury can become peritonitis or shock.",
              "Approach matters: open and laparoscopic recovery expectations are not interchangeable."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "Shoulder-tip discomfort may occur after laparoscopy, but it does not make all severe pain normal.",
              "immediateActionFinding": "Instability with rigid abdomen or worsening pain.",
              "mostImportantComplication": "Bile leak/duct injury or hemorrhage.",
              "patientTeaching": "Report fever, jaundice, escalating pain, persistent vomiting, or wound/drain change.",
              "positioningPrecaution": "Head elevation, pulmonary hygiene, and incision support as tolerated.",
              "priorityAssessment": "Airway recovery, hemodynamics, abdomen, pain trend, and jaundice or bilious drainage."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "nlm-cholecystectomy",
              "sages-cholecystectomy"
            ]
          }
        ],
        "sourceKeys": [
          "nlm-cholecystectomy",
          "sages-cholecystectomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM cholecystectomy education and SAGES safety guidance; drain use, diet, activity, and conversion risk depend on operative findings and the treating team.",
        "studentFacing": true,
        "summary": "Cholecystectomy removes the gallbladder, most often through small laparoscopic or robotic incisions and sometimes through an open incision. It treats symptomatic or complicated gallbladder disease; conversion from minimally invasive to open surgery is a safety decision, not a failure.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "c5156ed07292285a101c5c51507bacdd4d6caf929b212dcbf413ab80ea6a02c0",
          "stableId": "surgery-procedure:gastrointestinal-general:cholecystectomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "common-language",
            "value": "gallbladder removal"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "laparoscopic cholecystectomy"
          },
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "lap chole"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "open cholecystectomy"
          },
          {
            "identity": true,
            "kind": "common-misspelling",
            "value": "cholecystectemy"
          }
        ],
        "whyItMatters": "Jaundice or bilious drainage after surgery can point to a bile-duct problem rather than routine healing. Early walking and lung expansion reduce venous stasis and atelectasis after anesthesia. Severe or worsening abdominal pain matters because bleeding, leak, or bowel injury can become peritonitis or shock. Approach matters: open and laparoscopic recovery expectations are not interchangeable."
      },
      {
        "abbreviations": [],
        "aliases": [
          "appendix removal",
          "laparoscopic appendectomy",
          "open appendectomy",
          "appendicectomy",
          "appendectamy"
        ],
        "browse": {
          "branchId": "gastrointestinal-general",
          "branchIds": [
            "gastrointestinal-general",
            "trauma-emergency",
            "perioperative-care"
          ],
          "label": "Gastrointestinal and General Surgery"
        },
        "category": "Surgeries & Procedures / Gastrointestinal and General Surgery",
        "commonMisspellings": [
          "appendectamy"
        ],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Appendicitis",
            "id": "surgery-procedure:gastrointestinal-general:appendectomy:link:1",
            "label": "Appendicitis",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:appendectomy",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:gastrointestinal-general:appendectomy",
        "displayName": "Appendectomy (appendix removal)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Appendectomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:gastrointestinal-general:appendectomy",
        "name": "Appendectomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "gastrointestinal-general",
            "trauma-emergency",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "laparoscopic",
              "open"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 4,
          "primaryBranchId": "gastrointestinal-general",
          "safetyVisibleSectionIds": [
            "pain-management"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Appendectomy removes an inflamed or infected appendix, usually laparoscopically and sometimes through an open incision. It is commonly urgent because perforation can spread contamination through the abdomen, although selected uncomplicated appendicitis may be managed differently by the treating team.",
        "relatedTopics": [
          "Appendicitis"
        ],
        "searchTerms": [
          "appendectamy",
          "Appendectomy",
          "Appendectomy (appendix removal)",
          "appendicectomy",
          "appendicitis surgery",
          "appendix removal",
          "laparoscopic appendectomy",
          "open appendectomy",
          "post appendectomy nursing care",
          "ruptured appendix surgery"
        ],
        "sections": [
          {
            "content": "The appendix is a narrow pouch attached to the cecum, the first part of the large intestine in the right lower abdomen. The operation separates and removes it while protecting the bowel and controlling contamination if perforation or abscess is present.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": [
              "Acute appendicitis when surgery is the selected treatment.",
              "Perforated, gangrenous, or recurrent appendicitis and selected appendiceal masses or complications.",
              "The urgency rises with peritonitis, sepsis, obstruction, or clinical deterioration."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Under anesthesia, the surgeon removes the appendix through laparoscopic ports or an open right-lower abdominal incision. If perforation or abscess is present, contaminated material is managed and a drain may be placed selectively; the patient then recovers with abdominal, infection, intake, and mobility monitoring.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Trend pain migration and severity, guarding or rigidity, fever, heart rate, pressure, hydration, nausea/vomiting, urine output, blood count, pregnancy testing when relevant, imaging, sepsis cues, allergies, and prior abdominal surgery. Avoid giving oral intake outside the surgical plan. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Explain the individualized fasting and medication plan, anesthesia, laparoscopic versus possible open approach, pain and nausea control, breathing exercises, early mobility, and that perforation may lengthen treatment or require antibiotics/drain care. Do not promise a fixed discharge time.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "The surgeon explains surgical and nonoperative alternatives when applicable, bleeding, infection, bowel injury, abscess, and possible open conversion. The nurse verifies consent before impairing sedation, identity, allergies, capacity, interpreter access, and sends unanswered procedure questions back to the surgeon.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Assess airway and circulation, pain, temperature, abdominal distention or rigidity, incision/drain findings, nausea, hydration, urine output, and return of function. Patients with perforation need especially close surveillance for sepsis, abscess, ileus, and wound infection.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "An IV is expected; a urinary catheter is selective and often temporary. A drain is not routine for every appendectomy, but when present its amount, character, patency, and surrounding skin are documented because purulent or feculent change may signal ongoing infection or bowel complication.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Incisional soreness, temporary fatigue, mild nausea, and limited appetite may occur and should trend better. Recovery may be faster after uncomplicated laparoscopy and slower after perforation, abscess, or open surgery; stable vital signs and improving abdominal findings are more important than a rigid timeline.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": {
              "early": [
                "Bleeding, surgical-site infection, intra-abdominal abscess, peritonitis or sepsis after perforation, ileus, bowel injury, urinary retention, respiratory complication, and venous thromboembolism."
              ],
              "later": [
                "Adhesive bowel obstruction, incisional hernia, persistent abscess, or wound complication."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": [
              {
                "action": "Escalate urgently, support ABCs, assess for sepsis, keep intake consistent with the surgical plan, and obtain ordered cultures, labs, and imaging.",
                "finding": "Rigid or increasingly distended abdomen, escalating pain, fever, tachycardia, hypotension, or new confusion",
                "why": "Peritonitis, abscess, leak, or sepsis can worsen quickly after perforated appendicitis."
              },
              {
                "action": "Notify the surgical team promptly and assess hydration, electrolytes, and possible ileus or obstruction.",
                "finding": "Persistent vomiting, absent passage with worsening distention, or inability to tolerate fluids",
                "why": "Ongoing gastrointestinal dysfunction can cause aspiration, dehydration, and bowel compromise."
              },
              {
                "action": "Begin urgent cardiopulmonary evaluation.",
                "finding": "Dyspnea, chest pain, or unilateral leg swelling",
                "why": "Postoperative venous thromboembolism is time-sensitive."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Use head elevation, turning, cough support, and early assisted walking as tolerated. Protect the incision and follow individualized lifting/activity limits, especially after open surgery or complicated infection.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Advance intake under the surgical pathway as nausea, abdominal status, and clinical recovery permit. Monitor hydration, urine, gas/stool, distention, and vomiting; do not rely on bowel sounds alone as a universal feeding rule.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia and reassess breathing, mobility, and abdominal findings. Pain should become more manageable; new diffuse or sharply worsening pain with systemic changes requires urgent reassessment.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "Teach incision or drain care, prescribed antibiotics when applicable, hydration, gradual activity, follow-up, and when to seek care. Fever, increasing abdominal pain or swelling, repeated vomiting, inability to hydrate, wound pus, dyspnea, or fainting needs prompt evaluation.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": "No named appendectomy mnemonic substitutes for monitoring the abdomen, infection/sepsis, hydration, bowel recovery, wounds, breathing, and mobility.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": [
              "A perforated appendix can contaminate the peritoneum and lead to abscess or sepsis.",
              "Pain that becomes diffuse or worsens with instability is not routine incisional pain.",
              "Hydration and elimination trends help reveal ileus, vomiting-related losses, and poor perfusion.",
              "Early breathing exercises and mobility reduce pulmonary and thrombotic complications."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "Not every postoperative pain or low appetite is harmless; the trend and systemic signs determine urgency.",
              "immediateActionFinding": "Rigid distended abdomen with systemic deterioration.",
              "mostImportantComplication": "Peritonitis, abscess, or sepsis after perforation.",
              "patientTeaching": "Report fever, worsening abdominal findings, vomiting, or wound drainage.",
              "positioningPrecaution": "Position for comfort and breathing while protecting the abdominal incision.",
              "priorityAssessment": "Hemodynamics, fever, abdominal trend, pain, hydration, and sepsis cues."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "acs-appendectomy",
              "nlm-appendectomy"
            ]
          }
        ],
        "sourceKeys": [
          "acs-appendectomy",
          "nlm-appendectomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM and American College of Surgeons procedure education; antibiotics, drain use, feeding, and recovery differ for uncomplicated versus perforated disease.",
        "studentFacing": true,
        "summary": "Appendectomy removes an inflamed or infected appendix, usually laparoscopically and sometimes through an open incision. It is commonly urgent because perforation can spread contamination through the abdomen, although selected uncomplicated appendicitis may be managed differently by the treating team.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "992fabf88c72b6920bc1a7ea7eeb410fe6c4284ac91fcb54e8634b086da3c62f",
          "stableId": "surgery-procedure:gastrointestinal-general:appendectomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "common-language",
            "value": "appendix removal"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "laparoscopic appendectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "open appendectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "appendicectomy"
          },
          {
            "identity": true,
            "kind": "common-misspelling",
            "value": "appendectamy"
          }
        ],
        "whyItMatters": "A perforated appendix can contaminate the peritoneum and lead to abscess or sepsis. Pain that becomes diffuse or worsens with instability is not routine incisional pain. Hydration and elimination trends help reveal ileus, vomiting-related losses, and poor perfusion. Early breathing exercises and mobility reduce pulmonary and thrombotic complications."
      },
      {
        "abbreviations": [],
        "aliases": [
          "colon resection",
          "large bowel resection",
          "bowel resection with colostomy",
          "partial colectomy",
          "colectomy with stoma"
        ],
        "browse": {
          "branchId": "gastrointestinal-general",
          "branchIds": [
            "gastrointestinal-general",
            "perioperative-care"
          ],
          "label": "Gastrointestinal and General Surgery"
        },
        "category": "Surgeries & Procedures / Gastrointestinal and General Surgery",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Colorectal cancer",
            "id": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy:link:1",
            "label": "Colorectal cancer",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "Crohn disease",
            "id": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy:link:2",
            "label": "Crohn disease",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "Ulcerative colitis",
            "id": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy:link:3",
            "label": "Ulcerative colitis",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "displayName": "Colectomy (large-bowel removal, sometimes with an ostomy)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Colectomy with possible ostomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "name": "Colectomy with possible ostomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "gastrointestinal-general",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "laparoscopic",
              "robotic"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 5,
          "primaryBranchId": "gastrointestinal-general",
          "safetyVisibleSectionIds": [
            "pain-management"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Colectomy removes part or all of the colon (large intestine). The surgeon may reconnect the bowel or create an ostomy, an opening that brings bowel to the abdominal surface, when a safe connection is not possible or needs time to heal.",
        "relatedTopics": [
          "Colorectal cancer",
          "Crohn disease",
          "Ulcerative colitis"
        ],
        "searchTerms": [
          "bowel resection with colostomy",
          "Colectomy (large-bowel removal, sometimes with an ostomy)",
          "colectomy nursing care",
          "Colectomy with possible ostomy",
          "colectomy with stoma",
          "colon removal",
          "colon resection",
          "colostomy after bowel surgery",
          "large bowel resection",
          "new ostomy care",
          "partial colectomy"
        ],
        "sections": [
          {
            "content": "The colon includes the cecum, ascending, transverse, descending, and sigmoid segments and leads to the rectum. The operation may also involve nearby blood vessels, lymph nodes, small bowel, rectum, and abdominal wall when a stoma is formed.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": [
              "Colorectal cancer, complicated diverticular disease, inflammatory bowel disease, ischemia, obstruction, perforation, bleeding, or selected polyps.",
              "The amount removed and whether an ostomy is temporary or permanent depend on disease location, tissue health, contamination, and whether the remaining bowel can be joined safely."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Under anesthesia, diseased colon is removed through open, laparoscopic, or robotic access. Healthy bowel ends may be joined in an anastomosis; otherwise stool is diverted through an ileostomy or colostomy into an external pouch while healing occurs or as a permanent route.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Assess hydration, nutrition, weight change, abdominal pain/distention, vomiting, bowel pattern, bleeding, anemia, infection or sepsis, skin integrity, mobility, comorbidities, allergies, and ordered laboratory/imaging results. Verify the individualized bowel-preparation, antibiotic, fasting, and medication plan. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Explain anesthesia, pulmonary exercises, pain control, early walking, tubes, gradual intake, and the possibility of open conversion. If an ostomy is possible, arrange preoperative ostomy-nurse teaching and site marking when feasible; use direct language and avoid promising that a stoma will be temporary.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "The surgeon explains the planned resection, possible ostomy, anastomotic leak, bleeding, infection, organ injury, sexual or urinary effects, and alternatives. The nurse verifies signed consent before sedating medicine, identity, allergies, capacity, interpreter access, site preparation, and escalation of unanswered questions.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Assess airway, circulation, temperature, pain, abdominal contour, incision, drains, nausea, urine output, bowel function, mobility, and sepsis cues. If a stoma is present, inspect color, moisture, swelling, output, pouch seal, and surrounding skin; dusky, black, or very pale tissue is not an expected finding.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "IV access and sequential compression devices are common. A urinary catheter, nasogastric tube, surgical drain, central access, or ostomy may be used based on the operation and recovery. Document indication, patency, output amount and character, securement, and removal readiness rather than assuming every device is routine.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Incisional pain, fatigue, temporary reduced appetite, gradual return of bowel function, and early stoma swelling can occur. A healthy stoma is moist and pink to red; output varies by stoma location. Trends should show stable hemodynamics, improving mobility, manageable symptoms, and progressive self-care.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage, anastomotic leak, peritonitis, sepsis, ileus, obstruction, abscess, wound infection, urinary injury, respiratory complication, and venous thromboembolism."
              ],
              "later": [
                "Adhesive obstruction, incisional or parastomal hernia, stricture, chronic bowel-pattern changes, nutritional problems, and disease recurrence."
              ],
              "ostomySpecific": [
                "Stoma ischemia or necrosis, retraction, prolapse, separation, blockage, high-output dehydration, and peristomal skin injury."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": [
              {
                "action": "Escalate urgently, support ABCs, assess for sepsis, and prepare for ordered laboratory and imaging evaluation.",
                "finding": "Tachycardia, hypotension, fever, increasing abdominal pain or rigidity, confusion, or purulent/feculent drain output",
                "why": "An anastomotic leak or intra-abdominal infection can rapidly cause peritonitis and shock."
              },
              {
                "action": "Notify the surgical team immediately and do not apply pressure or insert anything unless specifically ordered.",
                "finding": "Dusky, black, very pale, dry, or suddenly nonfunctioning stoma with pain and distention",
                "why": "Poor blood supply or obstruction can threaten bowel viability."
              },
              {
                "action": "Escalate hydration and electrolyte assessment promptly.",
                "finding": "Large watery ostomy losses with dizziness, low urine output, tachycardia, or weakness",
                "why": "High output can cause rapid volume, sodium, magnesium, and kidney complications."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Use head elevation, turning, cough support, and early assisted walking. Protect incisions, drains, and the pouch during transfers; follow individualized lifting limits and teach safe mobility without pulling on the stoma appliance.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "disclosure",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Advance intake according to the surgical pathway, nausea, abdominal findings, and bowel recovery. Measure urine and stool or ostomy output, monitor hydration/electrolytes, and teach chewing, fluid intake, and individualized food reintroduction; do not impose one permanent diet on every ostomy patient.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia and reassess breathing, cognition, mobility, and bowel recovery. Support the abdomen during movement. New severe or escalating pain with systemic, abdominal, or stoma changes requires urgent reassessment rather than automatic additional analgesia alone.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "Teach wound and ostomy care, pouch emptying and fitting, output and hydration monitoring, supplies, activity, medications, follow-up, body-image support, and access to an ostomy nurse. Seek urgent care for fever, worsening pain/distention, vomiting, dehydration, no output with symptoms, bleeding, or abnormal stoma color.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": "No validated mnemonic replaces a structured check of circulation, abdomen, anastomotic-leak cues, hydration, elimination, wounds, stoma viability, breathing, mobility, and self-care readiness.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": [
              "A leak from a new bowel connection can turn into peritonitis and sepsis before the incision looks abnormal.",
              "Stoma color directly reflects tissue perfusion, so a dusky or black stoma requires immediate escalation.",
              "High ostomy output can dehydrate a patient quickly and impair kidney function.",
              "Early, respectful ostomy teaching supports safety, confidence, nutrition, and long-term quality of life."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "An ostomy is not automatically permanent, but the nurse must not promise reversal.",
              "immediateActionFinding": "Dusky/black stoma or instability with rigid painful abdomen.",
              "mostImportantComplication": "Anastomotic leak with peritonitis or stoma ischemia.",
              "patientTeaching": "Know normal stoma appearance, hydration needs, pouch care, and urgent warning signs.",
              "positioningPrecaution": "Support the abdominal incision and protect drains and pouch during mobility.",
              "priorityAssessment": "Hemodynamics, abdomen, sepsis cues, urine and bowel output, wound, and stoma viability."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "ascrs-ostomy",
              "nlm-colectomy"
            ]
          }
        ],
        "sourceKeys": [
          "ascrs-ostomy",
          "nlm-colectomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM large-bowel resection guidance and ASCRS ostomy education; reconstruction, stoma duration, diet, and device use are individualized.",
        "studentFacing": true,
        "summary": "Colectomy removes part or all of the colon (large intestine). The surgeon may reconnect the bowel or create an ostomy, an opening that brings bowel to the abdominal surface, when a safe connection is not possible or needs time to heal.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "4668c49eab840a8bdb7da0d458e5016571e69fa6a54b68f7945e413cbe65cfca",
          "stableId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "colon resection"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "large bowel resection"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "bowel resection with colostomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "partial colectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "colectomy with stoma"
          }
        ],
        "whyItMatters": "A leak from a new bowel connection can turn into peritonitis and sepsis before the incision looks abnormal. Stoma color directly reflects tissue perfusion, so a dusky or black stoma requires immediate escalation. High ostomy output can dehydrate a patient quickly and impair kidney function. Early, respectful ostomy teaching supports safety, confidence, nutrition, and long-term quality of life."
      },
      {
        "abbreviations": [],
        "aliases": [
          "thyroid removal",
          "total thyroidectomy",
          "partial thyroidectomy",
          "thyroid lobectomy",
          "thyroid surgery"
        ],
        "browse": {
          "branchId": "endocrine",
          "branchIds": [
            "endocrine",
            "ent-head-neck",
            "perioperative-care"
          ],
          "label": "Endocrine Procedures"
        },
        "category": "Surgeries & Procedures / Endocrine Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Thyroid cancer",
            "id": "surgery-procedure:endocrine:thyroidectomy:link:1",
            "label": "Thyroid cancer",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:endocrine:thyroidectomy",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "Hyperthyroidism",
            "id": "surgery-procedure:endocrine:thyroidectomy:link:2",
            "label": "Hyperthyroidism",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:endocrine:thyroidectomy",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:endocrine:thyroidectomy",
        "displayName": "Thyroidectomy (partial or total thyroid removal)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Thyroidectomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:endocrine:thyroidectomy",
        "name": "Thyroidectomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "endocrine",
            "ent-head-neck",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "minimally-invasive"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent"
            ]
          },
          "pilotSequence": 6,
          "primaryBranchId": "endocrine",
          "safetyVisibleSectionIds": [
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Thyroidectomy removes all or part of the thyroid gland in the front of the neck. The highest-priority early nursing concerns are airway-threatening neck bleeding, voice or breathing change from nerve injury, and low calcium after parathyroid disruption.",
        "relatedTopics": [
          "Thyroid cancer",
          "Hyperthyroidism"
        ],
        "searchTerms": [
          "neck surgery calcium",
          "partial thyroidectomy",
          "post thyroidectomy nursing care",
          "recurrent laryngeal nerve injury",
          "thyroid lobectomy",
          "thyroid removal",
          "thyroid surgery",
          "Thyroidectomy",
          "Thyroidectomy (partial or total thyroid removal)",
          "total thyroidectomy"
        ],
        "sections": [
          {
            "content": "The thyroid wraps around the upper trachea near the recurrent and superior laryngeal nerves. Small parathyroid glands lie on its back surface and regulate calcium, so surgery must preserve airway structures, voice nerves, and parathyroid blood supply whenever possible.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": [
              "Confirmed or suspected thyroid cancer, compressive goiter or nodules, and selected hyperthyroidism not adequately managed by other therapy.",
              "The extent ranges from lobectomy to total removal based on diagnosis, anatomy, prior treatment, and surgeon-patient planning."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Under anesthesia, the surgeon exposes the gland through a neck approach, protects nearby nerves and parathyroids, controls thyroid vessels, and removes the planned portion. Some selected operations use smaller-access approaches, but postoperative airway, bleeding, voice, and calcium surveillance remains essential.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Document baseline voice, swallowing, breathing, neck size or compression, thyroid symptoms, heart rate/rhythm, calcium and thyroid studies, allergies, pregnancy status when relevant, and signs of uncontrolled thyrotoxicosis. Verify the individualized fasting and medication plan. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Explain the neck incision, anesthesia, semi-upright positioning, neck support during movement, voice and swallowing checks, calcium surveillance, pain control, and possible need for lifelong thyroid hormone after total removal. Teach the patient to report tingling, cramping, neck pressure, breathing difficulty, or voice change immediately.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "The surgeon explains bleeding, infection, airway compromise, recurrent or superior laryngeal nerve injury, hypoparathyroidism/hypocalcemia, thyroid hormone needs, and alternatives. The nurse verifies consent, baseline voice, identity, allergies, interpreter access, and resolution of unanswered questions before sedation.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Keep emergency airway and suction equipment immediately available per unit protocol. Position semi-upright, support the head and neck, and assess breathing, stridor, voice, swallowing, anterior and posterior neck swelling, dressing/drain output, vital trends, pain, and symptoms of hypocalcemia.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "IV access is routine; a neck drain may be used but is not universal. Oxygen, suction, airway equipment, and calcium replacement resources should be accessible according to orders and setting. Trend drain output and inspect behind the neck because blood may track posteriorly.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Mild incisional soreness, temporary hoarseness, throat irritation, and swallowing discomfort may occur and should improve. The neck should remain soft without rapidly increasing pressure; breathing should be unlabored and calcium symptoms absent.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": {
              "early": [
                "Neck hematoma with airway compression, hemorrhage, laryngeal edema, recurrent laryngeal nerve injury, bilateral vocal-cord dysfunction, hypocalcemia from hypoparathyroidism, thyroid storm in inadequately controlled hyperthyroidism, and infection."
              ],
              "later": [
                "Permanent hypoparathyroidism, persistent voice change, hypothyroidism, scar problems, or recurrent disease."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": [
              {
                "action": "Activate emergency airway and surgical response immediately, stay with the patient, provide oxygen, and prepare emergency equipment.",
                "finding": "Stridor, dyspnea, rapidly increasing neck swelling/pressure, frequent swallowing, or blood soaking/tracking behind the dressing",
                "why": "A neck hematoma can compress the trachea within minutes."
              },
              {
                "action": "Notify the surgical team promptly, institute seizure/cardiac precautions as indicated, and obtain ordered calcium evaluation and replacement.",
                "finding": "Perioral or fingertip tingling, muscle cramps, carpopedal spasm, tetany, seizure, or QT-related rhythm concern",
                "why": "Parathyroid injury can lower calcium and cause neuromuscular excitability or dangerous dysrhythmias."
              },
              {
                "action": "Escalate voice/airway assessment and keep oral intake aligned with swallowing safety.",
                "finding": "New marked hoarseness, weak voice, aspiration, or breathing change",
                "why": "Laryngeal nerve injury can impair airway protection or vocal-cord movement."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Use semi-Fowler positioning and support the head and neck during turning; avoid sudden hyperextension or tension on the incision. Progress walking after anesthesia while continuing airway and calcium surveillance.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Assess swallowing and nausea before advancing intake under orders. Offer a comfortable texture if swallowing is safe, monitor hydration and urine, and do not dismiss coughing or a wet voice with liquids.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Use ordered analgesia, cool measures if approved, and neck support, then reassess sedation, breathing, swallowing, and pain trend. Sudden pressure, choking sensation, or disproportionate neck pain requires inspection and escalation rather than analgesia alone.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Teach incision care, neck support, activity and follow-up, prescribed thyroid hormone or calcium/vitamin D use, and laboratory monitoring. Seek urgent care for breathing trouble, neck swelling, bleeding, tingling/spasm, fever, worsening voice/swallowing, palpitations, or severe weakness.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": "Think AIR-Ca-V: Airway and posterior neck bleeding first, Calcium symptoms next, then Voice and swallowing. This is a prioritization cue, not a replacement for the ordered postoperative assessment.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": [
              "A small neck space means postoperative bleeding can become an airway emergency rapidly.",
              "Tingling and spasm matter because falling calcium can progress to tetany, seizure, or dysrhythmia.",
              "Voice change may reflect laryngeal nerve dysfunction and impaired airway protection.",
              "Total thyroid removal commonly creates a lifelong thyroid-hormone requirement, so adherence and monitoring affect metabolism and safety."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "Checking only the front dressing can miss blood tracking behind the neck.",
              "immediateActionFinding": "Stridor with increasing neck swelling.",
              "mostImportantComplication": "Expanding neck hematoma with airway compression.",
              "patientTeaching": "Report dyspnea, neck pressure, tingling/spasm, or voice/swallow change immediately.",
              "positioningPrecaution": "Semi-Fowler with head and neck supported; avoid tension on the incision.",
              "priorityAssessment": "Airway, neck swelling/bleeding, voice/swallowing, and hypocalcemia signs."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "ata-thyroid-surgery",
              "nlm-thyroidectomy"
            ]
          }
        ],
        "sourceKeys": [
          "ata-thyroid-surgery",
          "nlm-thyroidectomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM and American Thyroid Association education; operation extent, calcium replacement, and hormone needs depend on diagnosis and residual gland/parathyroid function.",
        "studentFacing": true,
        "summary": "Thyroidectomy removes all or part of the thyroid gland in the front of the neck. The highest-priority early nursing concerns are airway-threatening neck bleeding, voice or breathing change from nerve injury, and low calcium after parathyroid disruption.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "d88508077d63c857fa00d686eef24392b8dde5e3857f4c17a17a3f7f12eff4cc",
          "stableId": "surgery-procedure:endocrine:thyroidectomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "common-language",
            "value": "thyroid removal"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "total thyroidectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "partial thyroidectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "thyroid lobectomy"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "thyroid surgery"
          }
        ],
        "whyItMatters": "A small neck space means postoperative bleeding can become an airway emergency rapidly. Tingling and spasm matter because falling calcium can progress to tetany, seizure, or dysrhythmia. Voice change may reflect laryngeal nerve dysfunction and impaired airway protection. Total thyroid removal commonly creates a lifelong thyroid-hormone requirement, so adherence and monitoring affect metabolism and safety."
      },
      {
        "abbreviations": [
          "THA"
        ],
        "aliases": [
          "THA",
          "total hip replacement",
          "hip replacement",
          "hip joint replacement",
          "hip arthroplasty"
        ],
        "browse": {
          "branchId": "orthopedic-musculoskeletal",
          "branchIds": [
            "orthopedic-musculoskeletal",
            "perioperative-care"
          ],
          "label": "Orthopedic and Musculoskeletal Procedures"
        },
        "category": "Surgeries & Procedures / Orthopedic and Musculoskeletal Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Osteoarthritis",
            "id": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty:link:1",
            "label": "Osteoarthritis",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "displayName": "Total hip arthroplasty (total hip replacement)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Total hip arthroplasty",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "name": "Total hip arthroplasty",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "orthopedic-musculoskeletal",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "minimally-invasive"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent"
            ]
          },
          "pilotSequence": 7,
          "primaryBranchId": "orthopedic-musculoskeletal",
          "safetyVisibleSectionIds": [
            "nursing-memory-aids",
            "pain-management",
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Total hip arthroplasty replaces the damaged femoral head and the hip socket surfaces with prosthetic components. It aims to relieve severe pain and restore function, but early nursing care must prevent dislocation, blood clots, infection, falls, and neurovascular injury.",
        "relatedTopics": [
          "Osteoarthritis"
        ],
        "searchTerms": [
          "hip arthroplasty",
          "hip joint replacement",
          "hip precautions",
          "hip replacement",
          "joint replacement",
          "post hip replacement nursing care",
          "THA",
          "Total hip arthroplasty",
          "Total hip arthroplasty (total hip replacement)",
          "total hip replacement"
        ],
        "sections": [
          {
            "content": "The hip is a ball-and-socket joint: the femoral head fits into the acetabulum of the pelvis. Muscles, tendons, capsule, nearby nerves, and blood vessels stabilize it; the surgical approach determines which movements place the healing joint at greatest dislocation risk.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": [
              "Severe pain and disability from osteoarthritis, inflammatory arthritis, osteonecrosis, fracture, or other structural damage when nonoperative treatment is insufficient.",
              "Urgent replacement may be used for selected hip fractures, while most degenerative-joint operations are planned electively."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Under anesthesia, damaged bone and cartilage are removed and femoral and acetabular prosthetic parts are implanted, with or without bone cement. Approach, fixation, and weight-bearing plan differ, so nursing precautions must follow the operative team's orders rather than one universal rule.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Assess pain and function, gait, falls, baseline neurovascular status, skin and infection, nutrition, anemia, cardiopulmonary risk, home supports, equipment needs, allergies, and ordered testing. Verify the individualized fasting and medication plan. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Teach breathing exercises, pain plan, ankle pumps, clot prevention, fall prevention, assistive-device use, early rehabilitation, wound care, and the exact approach-specific movement and weight-bearing precautions. Arrange home and caregiver planning before surgery when possible.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "The surgeon explains infection, bleeding, thromboembolism, dislocation, fracture, nerve/vessel injury, leg-length difference, loosening, revision, and alternatives. The nurse verifies consent, correct side, identity, allergies, baseline function/neurovascular findings, interpreter access, and unresolved-question referral.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Assess airway and circulation, pain, operative-site bleeding, distal color/warmth/pulses/capillary refill, movement and sensation, limb alignment, ordered positioning, and signs of dislocation or compartment compromise. Begin ordered prophylaxis, pulmonary hygiene, and supervised mobilization without skipping fall precautions.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "IV access and mechanical clot-prevention devices are common; a urinary catheter or wound drain is selective. Abduction positioning equipment may be ordered for some approaches. Check that devices protect alignment and skin without causing pressure injury or nerve compression.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Incisional pain, swelling, bruising, temporary weakness, and limited mobility are expected but should improve with rehabilitation. Distal perfusion and sensation should remain intact, the limb should not suddenly rotate or shorten, and the wound should not show progressive drainage or systemic infection.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": {
              "early": [
                "Dislocation, hemorrhage, periprosthetic fracture, nerve or vascular injury, infection, deep-vein thrombosis, pulmonary embolism, urinary retention, delirium, pressure injury, and falls."
              ],
              "later": [
                "Prosthetic joint infection, loosening, wear, instability, heterotopic ossification, persistent pain, and need for revision."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": [
              {
                "action": "Stop movement, maintain the limb in the found position, assess neurovascular status, and notify the surgical team urgently.",
                "finding": "Sudden severe hip pain, inability to move, limb shortening or abnormal rotation, or a pop",
                "why": "These findings may indicate prosthetic dislocation or fracture; forceful repositioning can worsen injury."
              },
              {
                "action": "Activate urgent cardiopulmonary evaluation and follow the emergency pathway.",
                "finding": "New chest pain, dyspnea, hypoxemia, tachycardia, or unilateral calf swelling",
                "why": "Major joint surgery increases venous thromboembolism risk."
              },
              {
                "action": "Escalate immediate neurovascular assessment.",
                "finding": "Cool pale foot, absent/decreased pulse, new numbness, or escalating pain",
                "why": "Vascular or nerve compromise threatens limb function."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Maintain ordered alignment and approach-specific hip precautions. Mobilize with physical therapy and the prescribed weight-bearing status; use assistive devices, raised seating or other equipment when ordered, and never infer posterior precautions for every surgical approach.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Resume intake as anesthesia recovery permits and support protein, fluid, and fiber needs. Monitor nausea, constipation, urine retention, and hydration because immobility, opioids, and anesthesia commonly affect elimination.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Combine ordered analgesia with ice if approved, repositioning within precautions, and scheduled rehabilitation. Reassess sedation, breathing, function, wound, and neurovascular findings; sudden mechanical pain or pain out of proportion is not routine soreness.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Teach wound care, exact movement/weight-bearing precautions, assistive-device safety, clot prevention, prescribed medicines, dental/procedure communication as directed, rehabilitation, and fall-proofing. Seek urgent care for dislocation signs, chest symptoms, calf swelling, fever, wound drainage, or neurovascular change.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": "Use ALIGN: Approach-specific precautions, Limb neurovascular checks, Infection surveillance, Gait/fall safety, and New clot or dislocation symptoms. ALIGN organizes assessment but never overrides the surgeon's movement and weight-bearing orders.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": [
              "Hip precautions are approach-specific because different tissues were divided or repaired.",
              "Sudden shortening or rotation can signal dislocation, which requires controlled medical reduction rather than bedside manipulation.",
              "Early movement lowers clot and pulmonary risks but must occur with fall and weight-bearing safeguards.",
              "Persistent drainage or fever matters because prosthetic infection can threaten the implant and require major treatment."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          },
          {
            "content": {
              "commonMisconception": "One fixed set of hip precautions does not apply to every approach.",
              "immediateActionFinding": "Sudden pain with shortened/rotated limb or acute dyspnea.",
              "mostImportantComplication": "Dislocation or venous thromboembolism.",
              "patientTeaching": "Follow weight-bearing, assistive-device, wound, and clot-prevention instructions.",
              "positioningPrecaution": "Use only the ordered approach-specific position and movement limits.",
              "priorityAssessment": "Neurovascular status, alignment/dislocation cues, bleeding, clot symptoms, pain, and mobility safety."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-hip-replacement",
              "nlm-hip-replacement"
            ]
          }
        ],
        "sourceKeys": [
          "aaos-hip-replacement",
          "nlm-hip-replacement"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM and AAOS hip-replacement guidance; approach, fixation, weight-bearing, and dislocation precautions remain surgeon-specific.",
        "studentFacing": true,
        "summary": "Total hip arthroplasty replaces the damaged femoral head and the hip socket surfaces with prosthetic components. It aims to relieve severe pain and restore function, but early nursing care must prevent dislocation, blood clots, infection, falls, and neurovascular injury.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "f135b6c0bfff3226adf208f6b31d9a6b2d2765610b41d0b704a0ba3b3370d61e",
          "stableId": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "THA"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "total hip replacement"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "hip replacement"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "hip joint replacement"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "hip arthroplasty"
          }
        ],
        "whyItMatters": "Hip precautions are approach-specific because different tissues were divided or repaired. Sudden shortening or rotation can signal dislocation, which requires controlled medical reduction rather than bedside manipulation. Early movement lowers clot and pulmonary risks but must occur with fall and weight-bearing safeguards. Persistent drainage or fever matters because prosthetic infection can threaten the implant and require major treatment."
      },
      {
        "abbreviations": [
          "TKA"
        ],
        "aliases": [
          "TKA",
          "total knee replacement",
          "knee replacement",
          "knee joint replacement",
          "knee arthroplasty"
        ],
        "browse": {
          "branchId": "orthopedic-musculoskeletal",
          "branchIds": [
            "orthopedic-musculoskeletal",
            "perioperative-care"
          ],
          "label": "Orthopedic and Musculoskeletal Procedures"
        },
        "category": "Surgeries & Procedures / Orthopedic and Musculoskeletal Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Osteoarthritis",
            "id": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty:link:1",
            "label": "Osteoarthritis",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "displayName": "Total knee arthroplasty (total knee replacement)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Total knee arthroplasty",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "name": "Total knee arthroplasty",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "orthopedic-musculoskeletal",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "minimally-invasive"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective"
            ]
          },
          "pilotSequence": 8,
          "primaryBranchId": "orthopedic-musculoskeletal",
          "safetyVisibleSectionIds": [
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Total knee arthroplasty resurfaces damaged ends of the femur and tibia, usually with a patellar component when indicated, using prosthetic materials. The main early nursing goals are pain-controlled mobility, intact limb circulation and nerves, and prevention of bleeding, clots, infection, falls, and stiffness.",
        "relatedTopics": [
          "Osteoarthritis"
        ],
        "searchTerms": [
          "joint replacement",
          "knee arthroplasty",
          "knee joint replacement",
          "knee replacement",
          "knee replacement rehab",
          "post knee replacement nursing care",
          "TKA",
          "Total knee arthroplasty",
          "Total knee arthroplasty (total knee replacement)",
          "total knee replacement"
        ],
        "sections": [
          {
            "content": "The knee joins the femur, tibia, and patella and depends on cartilage, ligaments, tendons, muscles, nerves, and vessels. Prosthetic components replace damaged joint surfaces while surrounding soft tissues provide alignment and stability.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": [
              "Severe pain, stiffness, deformity, or functional loss from osteoarthritis or selected inflammatory/post-traumatic disease when nonoperative treatment is insufficient.",
              "The decision considers symptoms, imaging, health risk, rehabilitation capacity, and patient goals rather than imaging alone."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Under anesthesia, damaged joint surfaces are removed, the limb is aligned, and metal and polymer components are fixed to the prepared bone. Soft-tissue balancing and rehabilitation support motion and stability; implant design and weight-bearing orders vary.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Assess pain, range of motion, gait, falls, baseline distal neurovascular status, skin or infection, edema, nutrition, anemia, cardiopulmonary risk, home barriers, support, allergies, and ordered testing. Verify individualized fasting and medication instructions. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Teach pulmonary exercises, pain plan, ankle pumps, clot prevention, early supervised walking, knee exercises, assistive-device and fall safety, wound care, realistic rehabilitation, and discharge supports. Explain that movement is important but must follow ordered weight-bearing and therapy guidance.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "The surgeon explains infection, bleeding, clots, nerve/vessel injury, stiffness, instability, fracture, persistent pain, loosening, revision, and alternatives. The nurse verifies consent, correct side, identity, allergies, baseline neurovascular/function findings, interpreter access, and escalation of unanswered questions.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Assess airway, circulation, pain, dressing/drainage, swelling, limb alignment, and distal color, warmth, pulse, capillary refill, movement, and sensation. Start ordered prophylaxis, pulmonary hygiene, range-of-motion and mobility plans while protecting the patient from falls and monitoring for excessive bleeding or compartment compromise.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "IV access and mechanical clot-prevention devices are common; urinary catheters and surgical drains are selective. A compression dressing, cold-therapy device, or motion device may be ordered. Verify device settings/orders, skin protection, circulation, and that tubing does not create pressure or fall hazards.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Pain, swelling, bruising, warmth, weakness, and limited flexion are expected early and should trend with recovery. Distal perfusion and sensation should remain intact, bleeding should not progressively saturate dressings, and movement goals are individualized rather than identical for every patient.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage, deep-vein thrombosis, pulmonary embolism, infection, nerve or vessel injury, compartment syndrome, fracture, urinary retention, delirium, pressure injury, and falls."
              ],
              "later": [
                "Prosthetic joint infection, stiffness, instability, loosening, wear, persistent pain, and revision surgery."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": [
              {
                "action": "Escalate immediate neurovascular and compartment assessment; keep dressings/devices under ordered management.",
                "finding": "Pain out of proportion, tense swelling, pain with passive movement, new numbness/weakness, or reduced distal perfusion",
                "why": "Compartment or vascular compromise can cause permanent muscle and nerve injury."
              },
              {
                "action": "Activate urgent cardiopulmonary evaluation.",
                "finding": "New dyspnea, chest pain, hypoxemia, tachycardia, or unilateral calf swelling",
                "why": "Knee replacement carries substantial venous thromboembolism risk."
              },
              {
                "action": "Notify the surgical team promptly and obtain ordered infection evaluation.",
                "finding": "Fever, increasing redness, drainage, wound separation, or worsening joint pain",
                "why": "Early prosthetic infection can threaten the implant and systemic health."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Maintain neutral alignment, avoid placing prolonged support directly behind the knee unless specifically ordered, and use prescribed weight-bearing and assistive devices. Begin supervised walking and exercises according to therapy and surgical plans with fall precautions.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Advance intake after anesthesia as tolerated and support protein, fluids, and fiber. Monitor nausea, constipation, urine retention, and hydration because anesthesia, opioids, and reduced mobility commonly disrupt elimination.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia, cold therapy if prescribed, elevation as directed, repositioning, and medication timing that enables therapy. Reassess sedation, breathing, function, wound, swelling, and neurovascular status; escalating pain with tense swelling is a warning, not simply undertreatment.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Teach wound care, exercises, prescribed weight-bearing, walker/cane safety, clot prevention, medication adherence, rehabilitation, and fall-proofing. Seek urgent care for chest symptoms, calf swelling, neurovascular change, excessive bleeding, fever, drainage, or rapidly worsening pain/swelling.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": "Use KNEE: Keep neurovascular checks current, Notice clot/infection signs, Enable ordered exercise and analgesia, and Eliminate falls. This cue organizes nursing priorities but does not set rehabilitation targets.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": [
              "Early movement helps prevent clots and stiffness, but safe analgesia and fall protection make that movement possible.",
              "Pain out of proportion with tense swelling matters because compartment compromise can permanently damage the limb.",
              "A prosthetic infection is difficult to eradicate and may require implant surgery, so wound and systemic changes deserve prompt evaluation.",
              "Neurovascular trends distinguish expected swelling from threatened circulation or nerve function."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          },
          {
            "content": {
              "commonMisconception": "More pain medication alone is not the answer to escalating pain with tense swelling.",
              "immediateActionFinding": "Acute dyspnea or pain out of proportion with neurovascular change.",
              "mostImportantComplication": "Venous thromboembolism or neurovascular/compartment compromise.",
              "patientTeaching": "Use the assistive device, exercises, clot prevention, and wound precautions exactly as instructed.",
              "positioningPrecaution": "Maintain ordered alignment and avoid unapproved prolonged knee flexion support.",
              "priorityAssessment": "Distal neurovascular status, bleeding/swelling, clot symptoms, infection, pain control, and safe mobility."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "aaos-knee-replacement",
              "nlm-knee-replacement"
            ]
          }
        ],
        "sourceKeys": [
          "aaos-knee-replacement",
          "nlm-knee-replacement"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM and AAOS knee-replacement guidance; device use, weight-bearing, and rehabilitation targets remain individualized.",
        "studentFacing": true,
        "summary": "Total knee arthroplasty resurfaces damaged ends of the femur and tibia, usually with a patellar component when indicated, using prosthetic materials. The main early nursing goals are pain-controlled mobility, intact limb circulation and nerves, and prevention of bleeding, clots, infection, falls, and stiffness.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "e29d145cdccb4a863fb85d035b0493b83ef43148d3c7fc471aafcd4024f3fe8c",
          "stableId": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "TKA"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "total knee replacement"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "knee replacement"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "knee joint replacement"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "knee arthroplasty"
          }
        ],
        "whyItMatters": "Early movement helps prevent clots and stiffness, but safe analgesia and fall protection make that movement possible. Pain out of proportion with tense swelling matters because compartment compromise can permanently damage the limb. A prosthetic infection is difficult to eradicate and may require implant surgery, so wound and systemic changes deserve prompt evaluation. Neurovascular trends distinguish expected swelling from threatened circulation or nerve function."
      },
      {
        "abbreviations": [],
        "aliases": [
          "brain surgery",
          "cranial surgery",
          "skull opening surgery",
          "awake craniotomy",
          "craniotamy"
        ],
        "browse": {
          "branchId": "neurologic-neurosurgery",
          "branchIds": [
            "neurologic-neurosurgery",
            "trauma-emergency",
            "perioperative-care"
          ],
          "label": "Neurologic and Neurosurgical Procedures"
        },
        "category": "Surgeries & Procedures / Neurologic and Neurosurgical Procedures",
        "commonMisspellings": [
          "craniotamy"
        ],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Brain tumor",
            "id": "surgery-procedure:neurologic-neurosurgery:craniotomy:link:1",
            "label": "Brain tumor",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:neurologic-neurosurgery:craniotomy",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "Epilepsy",
            "id": "surgery-procedure:neurologic-neurosurgery:craniotomy:link:2",
            "label": "Epilepsy",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:neurologic-neurosurgery:craniotomy",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "displayName": "Craniotomy (temporary opening of the skull)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Craniotomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "name": "Craniotomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "neurologic-neurosurgery",
            "trauma-emergency",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "stereotactic"
            ],
            "intents": [
              "diagnostic",
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 9,
          "primaryBranchId": "neurologic-neurosurgery",
          "safetyVisibleSectionIds": [
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Craniotomy temporarily removes a section of skull so the neurosurgeon can reach the brain; the bone flap is usually replaced before closure. Early nursing priorities are neurologic trend, airway and ventilation, intracranial-pressure warning signs, seizures, bleeding, and protection of the operative site.",
        "relatedTopics": [
          "Brain tumor",
          "Epilepsy"
        ],
        "searchTerms": [
          "awake craniotomy",
          "brain surgery",
          "brain tumor surgery",
          "cranial surgery",
          "craniotamy",
          "Craniotomy",
          "Craniotomy (temporary opening of the skull)",
          "intracranial pressure after surgery",
          "post craniotomy nursing care",
          "skull opening surgery"
        ],
        "sections": [
          {
            "content": "The procedure crosses scalp, skull, protective meninges, and a planned brain region or nearby vessels. The exact side and neurologic functions at risk depend on the lesion; swelling or bleeding matters because the rigid skull leaves little room for expansion.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": [
              "Remove or biopsy a brain tumor, evacuate hemorrhage or hematoma, repair vascular abnormalities, relieve pressure, treat infection, or address selected epilepsy or trauma problems.",
              "The urgency ranges from planned tumor surgery to emergency decompression for life-threatening bleeding or swelling."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Under general anesthesia or selected awake mapping, the surgeon creates a bone flap, opens the dura, performs the planned intracranial work, secures hemostasis, and usually replaces the flap. Postoperative care uses frequent neurologic observations and imaging/monitoring tailored to the site and indication.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Document neurologic baseline including consciousness, pupils, speech, motor strength, sensation, seizures, headache/vomiting, and functional deficits. Review airway, anticoagulation and bleeding risk, labs/imaging, infection, allergies, seizure medicines, and site/side verification. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Explain intensive neurologic checks, hair preparation only as ordered, pain/nausea control, seizure precautions, lines and possible monitoring, positioning, breathing exercises, mobility, and likely rehabilitation. If awake mapping is planned, explain its purpose without promising the exact experience or outcome.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "The neurosurgeon explains neurologic deficit, bleeding, stroke, edema, seizure, infection, cerebrospinal-fluid leak, need for further surgery, and alternatives. The nurse verifies consent, identity, side/site, baseline neurologic status, allergies, interpreter/capacity support, and escalation of unanswered questions.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Protect airway and ventilation, then trend consciousness, pupils, speech, strength, sensation, vital signs, headache, vomiting, seizure activity, incision/drainage, and fluid balance at the ordered frequency. Compare with the documented baseline; a subtle new deficit can be more important than the absolute score.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "IV and arterial access, urinary catheter, scalp or subgaleal drain, intracranial-pressure monitor, external ventricular drain, oxygen, and compression devices may be used according to indication. Level, clamp, zero, and handle neurologic drains only under the exact order and local protocol.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Headache, scalp swelling, fatigue, nausea, and temporary site-related deficits may occur, but should be interpreted against the operative plan and trend. Stable or improving consciousness, pupils, strength, speech, hemodynamics, and wound findings support recovery.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": {
              "early": [
                "Intracranial hemorrhage, cerebral edema and raised pressure, stroke, seizure/status epilepticus, airway compromise, cerebrospinal-fluid leak, infection, hydrocephalus, electrolyte disorders, and venous thromboembolism."
              ],
              "later": [
                "Persistent neurologic deficit, seizures, infection, hydrocephalus, wound/bone-flap problems, cognitive or emotional changes, and recurrence of the underlying disease."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": [
              {
                "action": "Activate urgent neurologic and neurosurgical evaluation, support airway/ventilation, and prepare for ordered imaging and intracranial-pressure management.",
                "finding": "Declining consciousness, new unequal or poorly reactive pupils, new weakness/speech change, repeated vomiting, or worsening severe headache",
                "why": "Bleeding, swelling, stroke, or herniation can progress rapidly inside the fixed skull."
              },
              {
                "action": "Protect from injury, support airway and oxygenation, time the seizure, and activate the seizure emergency protocol.",
                "finding": "Seizure lasting beyond the emergency plan, repeated seizures without recovery, or airway/cyanosis concern",
                "why": "Prolonged seizure raises metabolic demand and can worsen brain injury."
              },
              {
                "action": "Notify neurosurgery promptly, use ordered precautions, and do not obstruct suspected cerebrospinal-fluid drainage unless directed.",
                "finding": "Clear drainage from incision, nose, or ear; fever; neck stiffness; or worsening wound change",
                "why": "A cerebrospinal-fluid leak creates an infection pathway and may indicate a closure problem."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Maintain the neurosurgical team's prescribed head position and bed angle; avoid neck or hip positions that impair venous drainage when applicable. Use seizure and fall precautions, assist mobility, and avoid pressure on the bone flap or operative side as ordered.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Confirm alertness and swallowing safety before oral intake, especially with cranial-nerve or hemispheric deficits. Monitor sodium, glucose, fluid balance, urine output, constipation, and nausea because neurologic injury, endocrine disturbance, and medicines can disrupt them.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Treat pain and nausea with ordered therapy while preserving reliable neurologic assessment and ventilation. Reassess sedation, pupils, cognition, and headache character; escalating headache with neurologic change is a warning, not simply routine postoperative pain.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Teach wound care, activity and driving restrictions, seizure plan, medicines, rehabilitation, follow-up, and when to seek emergency care. New weakness, speech/vision change, seizure, confusion, repeated vomiting, severe worsening headache, fever, clear drainage, or wound breakdown requires prompt evaluation.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": "Use NEURO TREND: Note consciousness, Eyes/pupils, Unilateral weakness, Response/speech, Oxygenation; then Track headache/vomiting, Report seizures, Examine wound/leak, Note fluids/sodium, and Defend safe positioning. The operative baseline and ordered frequency remain authoritative.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": [
              "A new small neurologic change can be the first sign of expanding blood or edema.",
              "Ventilation matters because carbon-dioxide retention can increase cerebral blood flow and intracranial pressure.",
              "Clear drainage matters because cerebrospinal-fluid leakage can lead to meningitis.",
              "Positioning is not generic: lesion location and surgeon instructions determine the safe head position."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "Postoperative sleepiness cannot be assumed to be anesthesia without comparing the neurologic trend.",
              "immediateActionFinding": "Declining consciousness with pupil or motor change.",
              "mostImportantComplication": "Intracranial hemorrhage or edema with herniation.",
              "patientTeaching": "Treat new neurologic deficits, seizures, clear drainage, or severe worsening headache as urgent.",
              "positioningPrecaution": "Follow the prescribed head angle and side; protect venous drainage and operative site.",
              "priorityAssessment": "Airway/ventilation followed by serial neurologic trend and wound/leak assessment."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "aans-craniotomy",
              "nlm-craniotomy"
            ]
          }
        ],
        "sourceKeys": [
          "aans-craniotomy",
          "nlm-craniotomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM brain-surgery education and AANS neurosurgical guidance; position, deficits, drains, and monitoring depend on lesion location and operative plan.",
        "studentFacing": true,
        "summary": "Craniotomy temporarily removes a section of skull so the neurosurgeon can reach the brain; the bone flap is usually replaced before closure. Early nursing priorities are neurologic trend, airway and ventilation, intracranial-pressure warning signs, seizures, bleeding, and protection of the operative site.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "1071ad67b203e441e2e0bcb615167bd819d2087ee977501af5d0e2d10b78eaf2",
          "stableId": "surgery-procedure:neurologic-neurosurgery:craniotomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "common-language",
            "value": "brain surgery"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "cranial surgery"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "skull opening surgery"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "awake craniotomy"
          },
          {
            "identity": true,
            "kind": "common-misspelling",
            "value": "craniotamy"
          }
        ],
        "whyItMatters": "A new small neurologic change can be the first sign of expanding blood or edema. Ventilation matters because carbon-dioxide retention can increase cerebral blood flow and intracranial pressure. Clear drainage matters because cerebrospinal-fluid leakage can lead to meningitis. Positioning is not generic: lesion location and surgeon instructions determine the safe head position."
      },
      {
        "abbreviations": [],
        "aliases": [
          "spinal decompression",
          "decompressive laminectomy",
          "lamina removal",
          "lumbar laminectomy",
          "cervical laminectomy"
        ],
        "browse": {
          "branchId": "neurologic-neurosurgery",
          "branchIds": [
            "neurologic-neurosurgery",
            "orthopedic-musculoskeletal",
            "perioperative-care"
          ],
          "label": "Neurologic and Neurosurgical Procedures"
        },
        "category": "Surgeries & Procedures / Neurologic and Neurosurgical Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Cauda equina syndrome",
            "id": "surgery-procedure:neurologic-neurosurgery:laminectomy:link:1",
            "label": "Cauda equina syndrome",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:neurologic-neurosurgery:laminectomy",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "displayName": "Laminectomy (spinal decompression)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Laminectomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "name": "Laminectomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "neurologic-neurosurgery",
            "orthopedic-musculoskeletal",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "minimally-invasive"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 10,
          "primaryBranchId": "neurologic-neurosurgery",
          "safetyVisibleSectionIds": [
            "diet-and-elimination"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Laminectomy removes part or all of a vertebral lamina, the back portion of the bony spinal canal, to relieve pressure on the spinal cord or nerve roots. Nursing priorities are neurologic and bladder/bowel trends, spinal alignment, pain-controlled mobility, wound or cerebrospinal-fluid leakage, and clot/infection prevention.",
        "relatedTopics": [
          "Cauda equina syndrome"
        ],
        "searchTerms": [
          "cervical laminectomy",
          "decompressive laminectomy",
          "lamina removal",
          "Laminectomy",
          "Laminectomy (spinal decompression)",
          "lumbar laminectomy",
          "post laminectomy nursing care",
          "spinal decompression",
          "spinal stenosis surgery",
          "spine surgery log roll"
        ],
        "sections": [
          {
            "content": "The lamina forms the posterior arch of each vertebra around the spinal canal. Decompression occurs near the spinal cord, cauda equina, nerve roots, dura, muscles, and stabilizing joints; cervical, thoracic, and lumbar levels produce different neurologic risks.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": [
              "Spinal stenosis, nerve-root compression, selected disc or bone-spur disease, tumors or abscesses, trauma, or emergency cauda equina/spinal-cord compression.",
              "Fusion may be added when decompression would leave instability; laminectomy and spinal fusion are related but not identical procedures."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Under anesthesia, the surgeon reaches the affected spine, removes lamina and other compressive tissue, protects neural structures, and may add stabilization when indicated. Postoperative care preserves alignment and watches for new neural deficit, hematoma, infection, dural leak, and functional recovery.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Document pain, motor strength, sensation, gait, reflex changes, saddle sensation when relevant, bowel/bladder function, skin, infection, falls, respiratory status, allergies, and imaging/labs. Escalate progressive weakness or new retention/incontinence before routine preparation. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Teach the individualized fasting plan, pain and nausea control, pulmonary exercises, spinal alignment/log-rolling if ordered, early assisted mobility, brace use if prescribed, lifting/activity limits, and that numbness or weakness may recover gradually rather than immediately.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "The surgeon explains bleeding, infection, dural tear/cerebrospinal-fluid leak, nerve or cord injury, persistent symptoms, instability, possible fusion, and alternatives. The nurse verifies consent, level/site, baseline neurologic and elimination findings, identity, allergies, interpreter access, and unresolved-question escalation.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Assess airway, circulation, pain, dressing/drain, and serial motor, sensory, perfusion, gait-readiness, and bowel/bladder findings. Maintain ordered spinal alignment, watch for rapidly increasing wound pressure or clear drainage, and mobilize with prescribed assistance and fall protection.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "IV access is routine; a urinary catheter or closed wound drain may be temporary. A brace is used only if prescribed. Inspect drainage and device pressure points, maintain ordered suction or gravity, and do not manipulate suspected cerebrospinal-fluid leakage.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Incisional pain, stiffness, fatigue, and residual tingling can occur; radicular pain may improve before numbness or weakness. Findings should trend toward stable neurologic function, manageable pain, clean wound, safe mobility, and return of bladder function.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": {
              "early": [
                "Epidural hematoma with neural compression, new nerve or spinal-cord injury, dural tear/cerebrospinal-fluid leak, infection, hemorrhage, urinary retention, ileus, respiratory complication, and venous thromboembolism."
              ],
              "later": [
                "Instability, recurrent stenosis, scar-related symptoms, chronic pain, nonunion if fusion was added, adjacent-segment disease, and reoperation."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": [
              {
                "action": "Stop routine mobilization and obtain immediate spinal surgical assessment.",
                "finding": "New or worsening leg/arm weakness, numbness, saddle anesthesia, loss of bowel/bladder control, or severe radicular pain",
                "why": "A hematoma or recurrent compression can permanently injure neural tissue if decompression is delayed."
              },
              {
                "action": "Notify the surgical team promptly, maintain prescribed position, and handle drains/dressings only as ordered.",
                "finding": "Severe positional headache, clear wound drainage, or a tense enlarging wound",
                "why": "A dural leak or compressive collection may be present."
              },
              {
                "action": "Activate urgent cardiopulmonary evaluation.",
                "finding": "Dyspnea, chest pain, or unilateral leg swelling",
                "why": "Reduced mobility increases venous thromboembolism risk."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Maintain neutral alignment and use the ordered turning technique, often coordinated shoulder-hip movement when log rolling is required. Begin assisted walking under the surgeon/therapy plan; follow brace, lifting, bending, twisting, and driving restrictions specific to level and any fusion.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Advance intake after anesthesia as tolerated. Monitor nausea, constipation, urine retention, bladder scan findings, and bowel function; new retention with neurologic changes is an emergency clue rather than a routine opioid effect.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia, aligned repositioning, ice if prescribed, and activity pacing. Reassess sedation, breathing, strength, sensation, bladder/bowel function, and wound; new neurologic pain or deficit requires evaluation before assuming muscular soreness.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Teach wound care, safe transfers, ordered brace and activity limits, exercises, medication safety, constipation prevention, follow-up, and emergency symptoms. New weakness, saddle numbness, bowel/bladder loss, fever, drainage, severe headache, chest pain, or dyspnea requires prompt care.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": "Use SPINE: Strength and sensation, Pain pattern, Incision or clear leak, Neurogenic bladder/bowel, and Exact alignment/activity orders. This cue does not replace level-specific neurologic assessment.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": [
              "New weakness or bowel/bladder change can mean renewed compression and demands immediate escalation.",
              "Clear drainage or positional headache can signal a dural tear and cerebrospinal-fluid loss.",
              "Alignment and technique matter because uncontrolled twisting can stress healing tissue or instrumentation.",
              "Residual numbness does not necessarily mean failure; nerve recovery can lag behind pressure relief."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "Postoperative urinary retention with neurologic change cannot be dismissed as anesthesia alone.",
              "immediateActionFinding": "New weakness with urinary retention or incontinence.",
              "mostImportantComplication": "Epidural hematoma or neural compression with new deficit.",
              "patientTeaching": "Report new weakness, saddle numbness, elimination change, clear drainage, or severe positional headache.",
              "positioningPrecaution": "Maintain neutral alignment and use the ordered turn/brace plan.",
              "priorityAssessment": "Motor/sensory and bladder/bowel trend, wound/leak, pain, and alignment-safe mobility."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "aans-lumbar-stenosis",
              "nlm-laminectomy"
            ]
          }
        ],
        "sourceKeys": [
          "aans-lumbar-stenosis",
          "nlm-laminectomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM laminectomy education and AANS spinal-stenosis guidance; level, fusion, brace, and movement orders are individualized.",
        "studentFacing": true,
        "summary": "Laminectomy removes part or all of a vertebral lamina, the back portion of the bony spinal canal, to relieve pressure on the spinal cord or nerve roots. Nursing priorities are neurologic and bladder/bowel trends, spinal alignment, pain-controlled mobility, wound or cerebrospinal-fluid leakage, and clot/infection prevention.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "134f11bba1640abcb554677069088091a498163bac73fec4a2cf4399a649d916",
          "stableId": "surgery-procedure:neurologic-neurosurgery:laminectomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "spinal decompression"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "decompressive laminectomy"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "lamina removal"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "lumbar laminectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "cervical laminectomy"
          }
        ],
        "whyItMatters": "New weakness or bowel/bladder change can mean renewed compression and demands immediate escalation. Clear drainage or positional headache can signal a dural tear and cerebrospinal-fluid loss. Alignment and technique matter because uncontrolled twisting can stress healing tissue or instrumentation. Residual numbness does not necessarily mean failure; nerve recovery can lag behind pressure relief."
      },
      {
        "abbreviations": [
          "TURP"
        ],
        "aliases": [
          "TURP",
          "prostate resection",
          "prostate shaving procedure",
          "transurethral prostate surgery",
          "trans urethral resection"
        ],
        "browse": {
          "branchId": "male-reproductive",
          "branchIds": [
            "male-reproductive",
            "renal-urologic",
            "perioperative-care"
          ],
          "label": "Male Reproductive Procedures"
        },
        "category": "Surgeries & Procedures / Male Reproductive Procedures",
        "commonMisspellings": [
          "trans urethral resection"
        ],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Benign prostatic hyperplasia",
            "id": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate:link:1",
            "label": "Benign prostatic hyperplasia",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "displayName": "Transurethral resection of the prostate (TURP)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Transurethral resection of the prostate",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "name": "Transurethral resection of the prostate",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "male-reproductive",
            "renal-urologic",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "endoscopic"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent"
            ]
          },
          "pilotSequence": 11,
          "primaryBranchId": "male-reproductive",
          "safetyVisibleSectionIds": [
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Transurethral resection of the prostate (TURP) removes obstructing prostate tissue through an instrument passed into the urethra, without an external surgical incision. Nursing priorities are catheter and irrigation patency, bleeding, bladder spasm, urine output, infection, and fluid/electrolyte or neurologic changes.",
        "relatedTopics": [
          "Benign prostatic hyperplasia"
        ],
        "searchTerms": [
          "BPH surgery",
          "continuous bladder irrigation",
          "post TURP nursing care",
          "prostate resection",
          "prostate shaving procedure",
          "trans urethral resection",
          "transurethral prostate surgery",
          "Transurethral resection of the prostate",
          "Transurethral resection of the prostate (TURP)",
          "TUR syndrome",
          "TURP"
        ],
        "sections": [
          {
            "content": "The prostate surrounds the first part of the urethra below the bladder. Enlarged tissue can narrow urine flow; TURP cores out obstructing tissue while the outer gland remains, and the bladder/urethral lining and nearby venous channels can bleed during healing.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": [
              "Troublesome or complicated benign prostatic hyperplasia with retention, recurrent infection, stones, bleeding, kidney/upper-tract effects, or symptoms not adequately controlled by other treatment.",
              "TURP treats obstruction; it does not remove the entire prostate and is not equivalent to radical prostatectomy."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Under spinal or general anesthesia, a resectoscope passes through the urethra and removes chips of obstructing tissue with electrical or other surgical energy. A three-way catheter may then drain urine and deliver continuous bladder irrigation (CBI) to prevent obstructing clots.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Assess voiding pattern, retention, bladder distention, hematuria, infection symptoms, kidney function, hydration, baseline sodium/hemoglobin, cardiopulmonary risk, allergies, and ordered urine/lab results. Verify individualized fasting and medication instructions. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Explain endoscopic access, temporary catheter/possible CBI, urine color changes, bladder spasms, pain plan, breathing and mobility, avoiding catheter pulling or straining, and gradual urinary recovery. Discuss that temporary urgency or leakage may occur and sexual effects require clinician-specific counseling.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "The surgeon explains bleeding/transfusion, infection, urethral or bladder injury, incontinence, stricture, retrograde ejaculation, erectile effects, TUR syndrome, reoperation, and alternatives. The nurse verifies consent, identity, allergies, baseline urine/labs, interpreter access, and unanswered-question referral.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Assess airway/circulation, mental status, pain and bladder spasm, catheter patency, lower-abdominal distention, urine color/clots, true urine output, vital trends, bleeding, and fluid/electrolyte status. With CBI, calculate urine output by subtracting irrigant infused from total drainage.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "A large three-way urinary catheter may provide drainage, balloon tamponade, and CBI. Keep tubing unkinked and the bag below bladder level, record irrigant and drainage separately, titrate only to the ordered endpoint, and use manual irrigation only under an order/protocol.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Pink to light-red urine, small clots, urgency, and bladder spasms may occur early and should trend toward clearer drainage. Catheter flow should remain continuous without suprapubic distention; bright-red thick blood, increasing clots, or reduced output is not an expected trend.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage and clot retention, catheter obstruction, bladder perforation, urinary infection or sepsis, acute retention after catheter removal, and dilutional fluid/electrolyte disturbance known as TUR syndrome."
              ],
              "later": [
                "Urethral stricture, bladder-neck contracture, persistent incontinence or symptoms, retrograde ejaculation, and need for repeat treatment."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": [
              {
                "action": "Check tubing and bag position, stop unapproved manipulation, and notify the urologic team promptly for ordered patency management.",
                "finding": "Decreased drainage with suprapubic pain/distention, large clots, or fluid leaking around the catheter",
                "why": "Clot obstruction can overdistend the bladder and worsen bleeding."
              },
              {
                "action": "Escalate hemorrhage assessment urgently and support circulation.",
                "finding": "Bright-red thick drainage, rapidly increasing irrigation need, hypotension, tachycardia, pallor, or falling hemoglobin",
                "why": "Open prostatic venous channels can produce significant postoperative bleeding."
              },
              {
                "action": "Stop irrigation only if required by the emergency protocol/order, activate urgent evaluation, and obtain ordered sodium/osmolality assessment.",
                "finding": "New confusion, headache, nausea/vomiting, hypertension with bradycardia, visual change, seizure, or respiratory distress",
                "why": "Absorbed irrigation fluid can cause dilutional hyponatremia and neurologic/cardiopulmonary deterioration."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Avoid traction or tension on the catheter, assist early walking when stable, and use fall precautions after anesthesia. Follow activity restrictions that reduce pelvic strain, heavy lifting, prolonged sitting, and constipation during early healing.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Support ordered hydration when not contraindicated and monitor intake, true urine output, catheter drainage, constipation, and kidney function. Teach avoidance of straining and use of the prescribed bowel plan; hydration instructions must reflect cardiac or renal limits.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Treat pain and bladder spasm with ordered therapy, secure the catheter, and reassess drainage before attributing suprapubic pain to spasm alone. Obstruction-related pain requires restoration of flow under the approved plan.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "Teach catheter care if discharged with one, hydration plan, stool-softening/strain prevention, activity limits, temporary urine and urinary-symptom expectations, medication use, and follow-up. Seek urgent care for inability to void, heavy bleeding/clots, fever, severe pain, confusion, chest symptoms, or weakness.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": "For CBI, remember IN minus OUT equals urine: subtract irrigant infused from total drainage. Then check Flow, Color/clots, Bladder distention/spasm, and neurologic/fluid status. This arithmetic cue does not authorize changing the irrigation order.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": [
              "A drainage bag total is not true urine output when it includes irrigation fluid.",
              "Suprapubic pain with reduced flow often signals clot obstruction, not merely routine spasm.",
              "Heavy bright-red drainage may represent significant hemorrhage from prostatic vessels.",
              "Confusion or headache matters because fluid absorption can lower sodium and progress to seizure or pulmonary complications."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          },
          {
            "content": {
              "commonMisconception": "Total drainage from CBI is not the patient's urine volume.",
              "immediateActionFinding": "Confusion with headache/nausea or obstructed drainage with distention.",
              "mostImportantComplication": "Hemorrhage/clot retention or dilutional TUR syndrome.",
              "patientTeaching": "Avoid straining and report retention, heavy bleeding, fever, or confusion.",
              "positioningPrecaution": "Avoid catheter traction and kinking; keep drainage dependent.",
              "priorityAssessment": "Catheter/CBI patency, true urine output, bleeding, bladder distention, and neurologic/fluid status."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-bph-treatment",
              "nlm-turp"
            ]
          }
        ],
        "sourceKeys": [
          "niddk-bph-treatment",
          "nlm-turp"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM TURP education and NIDDK BPH treatment guidance; irrigation solution, catheter traction, discharge timing, and hydration orders are individualized.",
        "studentFacing": true,
        "summary": "Transurethral resection of the prostate (TURP) removes obstructing prostate tissue through an instrument passed into the urethra, without an external surgical incision. Nursing priorities are catheter and irrigation patency, bleeding, bladder spasm, urine output, infection, and fluid/electrolyte or neurologic changes.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "4526b97ab702e065e2331596c1d9af78e1965d01ce0e7058b370367c89d29a2b",
          "stableId": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "TURP"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "prostate resection"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "prostate shaving procedure"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "transurethral prostate surgery"
          },
          {
            "identity": true,
            "kind": "common-misspelling",
            "value": "trans urethral resection"
          }
        ],
        "whyItMatters": "A drainage bag total is not true urine output when it includes irrigation fluid. Suprapubic pain with reduced flow often signals clot obstruction, not merely routine spasm. Heavy bright-red drainage may represent significant hemorrhage from prostatic vessels. Confusion or headache matters because fluid absorption can lower sodium and progress to seizure or pulmonary complications."
      },
      {
        "abbreviations": [],
        "aliases": [
          "uterus removal",
          "total hysterectomy",
          "abdominal hysterectomy",
          "vaginal hysterectomy",
          "laparoscopic hysterectomy"
        ],
        "browse": {
          "branchId": "reproductive-gynecologic",
          "branchIds": [
            "reproductive-gynecologic",
            "perioperative-care"
          ],
          "label": "Reproductive and Gynecologic Procedures"
        },
        "category": "Surgeries & Procedures / Reproductive and Gynecologic Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Endometrial cancer",
            "id": "surgery-procedure:reproductive-gynecologic:hysterectomy:link:1",
            "label": "Endometrial cancer",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:reproductive-gynecologic:hysterectomy",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "displayName": "Hysterectomy (uterus removal)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Hysterectomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "name": "Hysterectomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "reproductive-gynecologic",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "laparoscopic",
              "robotic"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent",
              "emergent"
            ]
          },
          "pilotSequence": 12,
          "primaryBranchId": "reproductive-gynecologic",
          "safetyVisibleSectionIds": [
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Hysterectomy removes the uterus through an abdominal, laparoscopic/robotic, or vaginal approach. It permanently ends the ability to carry a pregnancy; removal of the cervix, fallopian tubes, or ovaries is a separate decision and must not be assumed from the word hysterectomy alone.",
        "relatedTopics": [
          "Endometrial cancer"
        ],
        "searchTerms": [
          "abdominal hysterectomy",
          "Hysterectomy",
          "Hysterectomy (uterus removal)",
          "laparoscopic hysterectomy",
          "post hysterectomy nursing care",
          "total hysterectomy",
          "uterine surgery",
          "uterus removal",
          "vaginal cuff precautions",
          "vaginal hysterectomy"
        ],
        "sections": [
          {
            "content": "The uterus sits in the pelvis between the bladder and rectum and connects to the cervix and vagina. Ureters, bladder, bowel, pelvic blood vessels, nerves, ovaries, and tubes are nearby, so surgical extent and approach affect urinary, bowel, hormonal, sexual, and recovery considerations.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": [
              "Cancer or precancer, fibroids, abnormal uterine bleeding, endometriosis/adenomyosis, uterine prolapse, severe pelvic pain, infection or obstetric hemorrhage in selected emergencies.",
              "Alternatives and whether ovaries/cervix are removed depend on diagnosis, age, risk, symptoms, and patient goals."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Under anesthesia, supporting tissues and uterine blood supply are divided and the uterus is removed through the abdomen or vagina. The vaginal cuff or remaining cervix is closed as appropriate; minimally invasive procedures use small ports, while open surgery uses a larger incision.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Assess bleeding and anemia, pain, pregnancy status when relevant, infection, urinary/bowel function, cardiopulmonary risk, prior pelvic surgery, allergies, emotional/reproductive concerns, support, and ordered testing. Clarify exact planned organ removal. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Explain the planned route and organs, fertility effect, possible hormonal consequences only if ovaries are removed, pain/nausea control, breathing and early walking, catheter and bleeding expectations, pelvic-rest/activity plan, and emotional support. Avoid implying that hysterectomy always causes menopause.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "The surgeon explains infertility, bleeding, infection, clots, bladder/ureter/bowel injury, sexual or urinary effects, conversion of approach, organ-removal extent, and alternatives. The nurse verifies consent matches the plan, identity, allergies, capacity/interpreter support, pregnancy testing when indicated, and unanswered-question escalation.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Assess airway/circulation, pain, abdominal distention, incision or vaginal bleeding, catheter and urine output, nausea, infection, mobility, and venous-thromboembolism cues. Compare bleeding with hemodynamics and inspect pads; rapidly increasing bright-red flow is not routine spotting.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "IV access and mechanical clot prevention are common; a urinary catheter is often temporary. A pelvic drain or vaginal packing may be used selectively. Document indication, output, patency, removal plan, and pad counts without removing packing or devices unless ordered.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Incisional or pelvic soreness, fatigue, temporary bloating/constipation, and light vaginal spotting or discharge may occur and should diminish. Urine output, bowel recovery, mobility, and pain should improve; heavy bleeding, foul drainage, or worsening systemic symptoms are not expected.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage, infection, bladder/ureter/bowel injury, urinary retention, ileus, vaginal-cuff problem, venous thromboembolism, respiratory complication, and anesthesia effects."
              ],
              "later": [
                "Pelvic-floor dysfunction, adhesion or bowel obstruction, cuff dehiscence, fistula, prolapse, sexual symptoms, chronic pain, and surgical menopause if ovaries were removed."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": [
              {
                "action": "Escalate hemorrhage assessment urgently and support circulation.",
                "finding": "Heavy bright-red vaginal bleeding, rapidly saturated pads, hypotension, tachycardia, pallor, or increasing abdominal distention",
                "why": "Pelvic bleeding can be concealed internally or appear vaginally and progress to shock."
              },
              {
                "action": "Notify the surgical team promptly and assess catheter patency without unapproved manipulation.",
                "finding": "Low urine output, flank/pelvic pain, hematuria, inability to void, or urine-like vaginal drainage",
                "why": "Bladder or ureter injury/obstruction needs early recognition to preserve kidney function and prevent infection."
              },
              {
                "action": "Stop straining/activity, protect exposed tissue with sterile saline-moistened material if present, and obtain urgent gynecologic evaluation.",
                "finding": "Sudden pelvic pressure, tissue protrusion, watery discharge, severe pain, fever, or foul drainage",
                "why": "Vaginal-cuff separation or infection can expose abdominal contents and become an emergency."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Use comfortable alignment, pulmonary hygiene, and early assisted walking with clot/fall precautions. Follow approach-specific limits on lifting, driving, exercise, and vaginal insertion/sexual activity until the surgeon confirms healing.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Advance intake as tolerated and support fluids, protein, and fiber. Monitor urine, retention, constipation, gas/stool, nausea, and abdominal distention; use the prescribed bowel plan to reduce straining while the pelvis heals.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia, incision support, heat/cold only if approved, repositioning, and early movement. Reassess bleeding, abdomen, urine, bowel function, sedation, and pain trend; escalating pelvic pain with systemic change requires evaluation.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Teach incision/perineal care, expected light discharge, medicines, constipation prevention, activity and pelvic-rest limits, and follow-up/pathology review. Seek urgent care for heavy bleeding, fever, foul drainage, worsening pain, urinary problems, chest symptoms, leg swelling, or tissue protrusion.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": "Clarify U-C-O before teaching: Uterus removed, Cervix removed or retained, Ovaries removed or retained. This prevents the common error of assuming every hysterectomy has the same hormonal, screening, and recovery implications.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": [
              "Hysterectomy ends uterine pregnancy capacity, but it does not automatically remove the ovaries or cause immediate menopause.",
              "Urine changes matter because the bladder and ureters lie close to the uterus.",
              "Heavy bleeding or worsening distention can signal concealed pelvic hemorrhage.",
              "Exact organ and approach information determines hormone effects, screening, sexual guidance, and recovery teaching."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "A hysterectomy does not always include ovary removal or immediate menopause.",
              "immediateActionFinding": "Heavy bleeding with instability or tissue protrusion.",
              "mostImportantComplication": "Pelvic hemorrhage or urinary-tract injury.",
              "patientTeaching": "Know which organs were removed and report heavy bleeding, fever, urinary change, or cuff warning signs.",
              "positioningPrecaution": "Promote mobility while following approach-specific pelvic-rest and lifting limits.",
              "priorityAssessment": "Hemodynamics/bleeding, urine output, abdomen, infection, clot symptoms, and pain-controlled mobility."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "acog-hysterectomy",
              "nlm-hysterectomy"
            ]
          }
        ],
        "sourceKeys": [
          "acog-hysterectomy",
          "nlm-hysterectomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM and ACOG hysterectomy education; route, organ extent, ovarian effects, and pelvic-rest duration are individualized.",
        "studentFacing": true,
        "summary": "Hysterectomy removes the uterus through an abdominal, laparoscopic/robotic, or vaginal approach. It permanently ends the ability to carry a pregnancy; removal of the cervix, fallopian tubes, or ovaries is a separate decision and must not be assumed from the word hysterectomy alone.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "411b629b22f0409d2004685d8b9a7c98f9569176689a8a82a1192c641cde8f26",
          "stableId": "surgery-procedure:reproductive-gynecologic:hysterectomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "common-language",
            "value": "uterus removal"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "total hysterectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "abdominal hysterectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "vaginal hysterectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "laparoscopic hysterectomy"
          }
        ],
        "whyItMatters": "Hysterectomy ends uterine pregnancy capacity, but it does not automatically remove the ovaries or cause immediate menopause. Urine changes matter because the bladder and ureters lie close to the uterus. Heavy bleeding or worsening distention can signal concealed pelvic hemorrhage. Exact organ and approach information determines hormone effects, screening, sexual guidance, and recovery teaching."
      },
      {
        "abbreviations": [],
        "aliases": [
          "breast removal surgery",
          "simple mastectomy",
          "total mastectomy",
          "modified radical mastectomy",
          "skin-sparing mastectomy"
        ],
        "browse": {
          "branchId": "dermatologic-plastic-reconstructive",
          "branchIds": [
            "dermatologic-plastic-reconstructive",
            "perioperative-care"
          ],
          "label": "Dermatologic, Plastic, and Reconstructive Procedures"
        },
        "category": "Surgeries & Procedures / Dermatologic, Plastic, and Reconstructive Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Breast cancer",
            "id": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy:link:1",
            "label": "Breast cancer",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "displayName": "Mastectomy (surgical breast removal)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Mastectomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "name": "Mastectomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "dermatologic-plastic-reconstructive",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent"
            ]
          },
          "pilotSequence": 13,
          "primaryBranchId": "dermatologic-plastic-reconstructive",
          "safetyVisibleSectionIds": [
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Mastectomy removes breast tissue to treat or reduce the risk of breast cancer. The exact operation may preserve skin or nipple, include sentinel or axillary lymph-node surgery, and include immediate reconstruction; those choices change wounds, drains, arm risks, and recovery teaching.",
        "relatedTopics": [
          "Breast cancer"
        ],
        "searchTerms": [
          "axillary node surgery",
          "breast cancer surgery",
          "breast removal surgery",
          "lymphedema precautions",
          "Mastectomy",
          "Mastectomy (surgical breast removal)",
          "modified radical mastectomy",
          "post mastectomy nursing care",
          "simple mastectomy",
          "skin-sparing mastectomy",
          "total mastectomy"
        ],
        "sections": [
          {
            "content": "Breast tissue lies over the chest wall and drains mainly toward axillary lymph nodes. Surgery may involve breast skin, nipple-areola, pectoral fascia, lymphatic channels, sensory nerves, and reconstruction donor or implant sites, but chest muscle removal is not routine in most modern mastectomies.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": [
              "Treat ductal carcinoma in situ or invasive breast cancer when mastectomy is selected based on disease, anatomy, prior treatment, genetics, or preference.",
              "Reduce future cancer risk in carefully counseled people with very high inherited or clinical risk; risk-reducing surgery lowers but does not make risk zero."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Under anesthesia, the surgeon removes the planned breast tissue and may sample or remove lymph nodes. Drains evacuate fluid from the surgical space; reconstruction may use an implant or the patient's tissue immediately or later. Pathology defines margins and nodal findings for further treatment planning.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Assess diagnosis and planned side/extent, baseline arm motion and sensation, skin, allergies, cardiopulmonary risk, nutrition, smoking, prior radiation/surgery, support, body-image and fertility concerns, and ordered imaging/labs. Clarify reconstruction and nodal plans. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Explain the planned tissue and node removal, drains, pain and sensation changes, arm/shoulder exercises when cleared, early walking, wound/reconstruction care, pathology follow-up, body-image support, and that lymphedema risk varies with lymphatic treatment rather than mastectomy alone.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "The surgeon explains bleeding, infection, seroma, flap/nipple or reconstruction loss, sensory change, pain, lymphedema risk, additional surgery, and alternatives. The nurse verifies consent, side/site, identity, allergies, reconstruction/lymph-node plan, interpreter/capacity support, and referral of unanswered questions.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Assess airway/circulation, pain, flap or skin color/warmth if applicable, incision/dressing, swelling/hematoma, drain patency/output, arm neurovascular status, nausea, mobility, and emotional response. Follow reconstruction-specific positioning and perfusion checks without placing pressure on the operative area.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "One or more closed-suction drains are common but depend on operation. IV access, compression devices, and reconstruction monitoring equipment may be used. Keep drains secured and compressed as ordered, measure each separately, and teach stripping/milking only if specifically included in local instructions.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Incisional tightness, bruising, numbness, fatigue, limited shoulder motion, and gradually decreasing serosanguineous drain output may occur. Skin or reconstructive tissue should remain viable, swelling should not rapidly expand, and pain/function should trend toward improvement.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage/hematoma, infection, seroma, wound separation, skin-flap or nipple necrosis, reconstruction compromise, nerve pain, respiratory complication, and venous thromboembolism."
              ],
              "later": [
                "Lymphedema, shoulder stiffness, chronic post-mastectomy pain, altered sensation, implant/capsular or donor-site problems, body-image distress, and cancer recurrence."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": [
              {
                "action": "Escalate hemorrhage evaluation urgently, support circulation, and protect the operative site.",
                "finding": "Rapid chest swelling, firmness, increasing bloody drainage, hypotension, tachycardia, or severe pressure",
                "why": "A chest-wall hematoma can compromise skin/reconstruction perfusion and cause significant blood loss."
              },
              {
                "action": "Notify the breast/plastic surgical team immediately and follow the flap-monitoring protocol.",
                "finding": "Pale, dusky, cool, dark, or poorly perfused skin/nipple/reconstruction tissue",
                "why": "Early vascular compromise can threaten tissue viability and may be time-sensitive."
              },
              {
                "action": "Obtain prompt infection, thrombosis, or cardiopulmonary assessment based on findings.",
                "finding": "New arm/chest redness, warmth, fever, rapidly increasing swelling, dyspnea, or chest pain",
                "why": "Infection, upper-extremity thrombosis, pulmonary embolism, and acute swelling require different urgent treatment."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Position according to breast and reconstruction orders, support the arm without traction, and avoid pressure on flap or donor sites. Encourage walking and prescribed gradual arm/shoulder exercises; do not impose permanent arm restrictions unsupported by the treating team's lymphedema plan.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Advance intake after anesthesia and support protein, fluid, and fiber for healing. Monitor nausea, constipation, urine, and hydration; reconstruction using abdominal tissue may require additional bowel, posture, and donor-site considerations.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Use ordered multimodal analgesia, positioning, drain securement, and gentle exercises when cleared. Distinguish incisional soreness from escalating pressure, burning neuropathic pain, or donor/flap ischemia warning signs, and reassess sedation and breathing.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Teach incision and drain care, output recording, reconstruction precautions, exercises, medicines, pathology/oncology follow-up, emotional and prosthesis resources, and individualized lymphedema risk reduction. Seek urgent care for rapid swelling, heavy bleeding, tissue color change, fever, pus, dyspnea, or chest pain.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": "Use BREAST: Bleeding/hematoma, Reconstruction or skin perfusion, Exercises when cleared, Axillary/arm assessment, Suction-drain care, and Teaching/support. The plan changes with node surgery and reconstruction, so this cue does not create universal arm restrictions.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": [
              "The word mastectomy does not tell you whether lymph nodes or reconstruction were included; nursing care must confirm the exact operation.",
              "Rapid swelling or firmness may be a hematoma that threatens both circulation and reconstructive tissue.",
              "Lymphedema risk comes mainly from lymph-node and radiation effects, and individualized prevention avoids unnecessary disability.",
              "Body-image, grief, sexuality, and cancer uncertainty are safety-relevant recovery needs, not optional extras."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          },
          {
            "content": {
              "commonMisconception": "Mastectomy does not automatically mean radical muscle removal or the same lymphedema risk for everyone.",
              "immediateActionFinding": "Rapid firm swelling with bloody output or dusky reconstructive tissue.",
              "mostImportantComplication": "Hematoma or reconstruction/skin-flap vascular compromise.",
              "patientTeaching": "Demonstrate drain care and report rapid swelling, tissue color change, fever, or chest symptoms.",
              "positioningPrecaution": "Protect the operative/reconstruction site and support the arm under the exact plan.",
              "priorityAssessment": "Hemodynamics, chest swelling, skin/flap perfusion, drains, pain, arm function, and clot/infection signs."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "nci-breast-surgery",
              "nlm-mastectomy"
            ]
          }
        ],
        "sourceKeys": [
          "nci-breast-surgery",
          "nlm-mastectomy"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM mastectomy education and NCI breast-cancer treatment guidance; nodal extent, reconstruction, drain care, and lymphedema plan are individualized.",
        "studentFacing": true,
        "summary": "Mastectomy removes breast tissue to treat or reduce the risk of breast cancer. The exact operation may preserve skin or nipple, include sentinel or axillary lymph-node surgery, and include immediate reconstruction; those choices change wounds, drains, arm risks, and recovery teaching.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "425c580e22ceec32623e5b93700ba234736ef3b8efd250505dfaab89b8526e49",
          "stableId": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "common-language",
            "value": "breast removal surgery"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "simple mastectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "total mastectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "modified radical mastectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "skin-sparing mastectomy"
          }
        ],
        "whyItMatters": "The word mastectomy does not tell you whether lymph nodes or reconstruction were included; nursing care must confirm the exact operation. Rapid swelling or firmness may be a hematoma that threatens both circulation and reconstructive tissue. Lymphedema risk comes mainly from lymph-node and radiation effects, and individualized prevention avoids unnecessary disability. Body-image, grief, sexuality, and cancer uncertainty are safety-relevant recovery needs, not optional extras."
      },
      {
        "abbreviations": [],
        "aliases": [
          "lobectomy",
          "lung lobe removal",
          "lung lobectomy",
          "VATS lobectomy",
          "robotic lung lobectomy"
        ],
        "browse": {
          "branchId": "respiratory-thoracic",
          "branchIds": [
            "respiratory-thoracic",
            "perioperative-care"
          ],
          "label": "Respiratory and Thoracic Procedures"
        },
        "category": "Surgeries & Procedures / Respiratory and Thoracic Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Lung cancer",
            "id": "surgery-procedure:respiratory-thoracic:lobectomy:link:1",
            "label": "Lung cancer",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:respiratory-thoracic:lobectomy",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:respiratory-thoracic:lobectomy",
        "displayName": "Pulmonary lobectomy (removal of one lung lobe)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Pulmonary lobectomy",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:respiratory-thoracic:lobectomy",
        "name": "Pulmonary lobectomy",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "respiratory-thoracic",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "minimally-invasive",
              "robotic"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent"
            ]
          },
          "pilotSequence": 14,
          "primaryBranchId": "respiratory-thoracic",
          "safetyVisibleSectionIds": [
            "positioning-and-activity",
            "tubes-drains-devices"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Pulmonary lobectomy removes one of the lung's lobes, most often to treat localized lung cancer. Because lung tissue, major airways, and pulmonary vessels are divided, early nursing care centers on oxygenation and ventilation, chest-tube function, bleeding or air leak, pain-controlled breathing, and mobility.",
        "relatedTopics": [
          "Lung cancer"
        ],
        "searchTerms": [
          "chest tube after lung surgery",
          "lobectomy",
          "lung cancer surgery",
          "lung lobe removal",
          "lung lobectomy",
          "post lobectomy nursing care",
          "Pulmonary lobectomy",
          "Pulmonary lobectomy (removal of one lung lobe)",
          "robotic lung lobectomy",
          "thoracotomy",
          "VATS lobectomy"
        ],
        "sections": [
          {
            "content": "The right lung has three lobes and the left has two. Each lobe receives a bronchus and pulmonary vessels; removal also affects pleura, lymph nodes, chest-wall muscles, and sometimes ribs depending on open thoracotomy versus minimally invasive access.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": [
              "Localized non-small cell lung cancer when anatomy and cardiopulmonary reserve permit, and selected localized benign lesions, infections, or damaged lung.",
              "Preoperative evaluation estimates whether remaining lung and heart function can support recovery; not every lung tumor is treated with lobectomy."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Under general anesthesia with lung isolation, the surgeon divides the target lobe's bronchus and vessels, removes the lobe through thoracotomy, video-assisted thoracoscopic surgery (VATS), or robotic access, and usually places one or more chest tubes to evacuate air and fluid while the remaining lung expands.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Assess baseline oxygenation, breathing pattern, cough/sputum, exercise tolerance, smoking, pulmonary-function and imaging results, cardiac risk, nutrition, infection, allergies, and home oxygen/support needs. Verify the individualized fasting and medication plan. Medication changes must be directed by the surgeon, anesthesiologist, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Teach coughing, deep breathing, incentive spirometry when ordered, splinting, pain-control options, chest-tube purpose, early walking, clot prevention, smoking cessation, and that temporary oxygen or rehabilitation may be needed. Explain that effective analgesia supports ventilation rather than being only a comfort goal.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "The surgeon explains bleeding, infection, prolonged air leak, pneumonia, respiratory failure, arrhythmia, clot, bronchopleural fistula, conversion to open surgery, greater resection if authorized, and alternatives. The nurse verifies consent, correct side, identity, allergies, baseline respiratory status, interpreter access, and unanswered-question referral.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Assess airway, respiratory rate/effort, bilateral breath sounds, oxygenation, circulation, rhythm, pain, incision, chest-tube system/output/air leak, subcutaneous emphysema, mental status, urine, and mobility. Optimize analgesia and pulmonary hygiene while watching for hemorrhage, tension physiology, or deteriorating gas exchange.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "A chest tube is common; IV/arterial access, oxygen, urinary catheter, epidural or regional analgesia, and compression devices may be used. Keep the drainage system upright and below the chest, maintain ordered suction or water seal, document air leak and output, and never clamp or strip routinely without a specific order/emergency protocol.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Incisional pain, reduced breath sounds on the operative side, small early air leak or serosanguineous drainage under the surgical plan, fatigue, and oxygen need may occur. Work of breathing, oxygenation, drainage, and air leak should trend favorably; sudden change is more important than a single isolated value.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage, prolonged air leak, pneumothorax or tension physiology, atelectasis, pneumonia, respiratory failure, arrhythmia (especially atrial), bronchopleural fistula, subcutaneous emphysema, venous thromboembolism, and infection."
              ],
              "later": [
                "Persistent dyspnea, chronic post-thoracotomy pain, pleural infection, reduced functional reserve, airway fistula, and cancer recurrence."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": [
              {
                "action": "Activate urgent thoracic/respiratory response, support oxygenation, and inspect the chest-tube circuit without unapproved clamping.",
                "finding": "Sudden dyspnea, hypoxemia, absent/worsening breath sounds, tracheal or hemodynamic change, or rapidly expanding subcutaneous emphysema",
                "why": "Tube obstruction/disconnection, pneumothorax, or tension physiology can become rapidly fatal."
              },
              {
                "action": "Escalate hemorrhage evaluation immediately and support circulation.",
                "finding": "Rapidly increasing bright-red chest drainage, hypotension, tachycardia, pallor, or falling hemoglobin",
                "why": "Pulmonary and chest-wall vessels can produce major intrathoracic bleeding."
              },
              {
                "action": "Promptly assess rhythm, infection, ventilation, and thromboembolism based on the pattern.",
                "finding": "New irregular tachycardia, chest pain, fever with worsening sputum, or increasing oxygen need",
                "why": "Atrial arrhythmia, pneumonia, embolism, or respiratory failure can delay recovery and become unstable."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Use head elevation and ordered side positioning; the surgeon's plan governs whether operative-side positioning is appropriate. Splint the incision, turn, perform pulmonary exercises, and walk early with oxygen/tube safety and fall precautions.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Advance intake once alert and swallowing is safe; monitor nausea, hydration, urine, constipation, and nutrition. Balance fluids carefully under the thoracic plan because both hypovolemia and excess fluid can impair recovery.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Use ordered multimodal, epidural, regional, or systemic analgesia and reassess sedation, blood pressure, breathing depth, cough, and mobility. Poorly controlled pain causes shallow ventilation, but sudden pain with respiratory change may signal a complication.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Teach incision care, breathing exercises, progressive walking, pain medicine safety, smoking cessation, oxygen use if prescribed, nutrition, follow-up, and pathology/oncology planning. Seek urgent care for new dyspnea, chest pain, hemoptysis, fever, wound drainage, palpitations, or leg swelling.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": "Use LUNG: Look at breathing and oxygenation, Understand chest-tube air/fluid trends, Notice bleeding/arrhythmia/infection, and Get pain-controlled coughing and mobility underway. LUNG does not replace ordered tube-management rules.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": [
              "A chest tube maintains pleural pressure conditions needed for the remaining lung to expand.",
              "Pain control protects ventilation because splinting and shallow breaths promote atelectasis and pneumonia.",
              "Rapid bright-red drainage may represent life-threatening intrathoracic hemorrhage.",
              "New atrial arrhythmia is common enough to watch for but still requires assessment of stability and causes."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          },
          {
            "content": {
              "commonMisconception": "A chest tube should not be clamped routinely during transport or troubleshooting.",
              "immediateActionFinding": "Sudden respiratory deterioration with tube-system or breath-sound change.",
              "mostImportantComplication": "Hemorrhage, tension pneumothorax, or respiratory failure.",
              "patientTeaching": "Continue breathing exercises and seek urgent care for dyspnea, chest pain, fever, or hemoptysis.",
              "positioningPrecaution": "Use the ordered side and head position; secure chest tubes during mobility.",
              "priorityAssessment": "Airway, work of breathing/oxygenation, chest-tube system and output, circulation/rhythm, and pain-enabled pulmonary hygiene."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "acs-lung-surgery",
              "nlm-lung-surgery"
            ]
          }
        ],
        "sourceKeys": [
          "acs-lung-surgery",
          "nlm-lung-surgery"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM lung-surgery education and American Cancer Society lobectomy guidance; chest-tube, side-positioning, fluid, and oxygen plans are individualized.",
        "studentFacing": true,
        "summary": "Pulmonary lobectomy removes one of the lung's lobes, most often to treat localized lung cancer. Because lung tissue, major airways, and pulmonary vessels are divided, early nursing care centers on oxygenation and ventilation, chest-tube function, bleeding or air leak, pain-controlled breathing, and mobility.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "a87ea23f3f2ab76055dda9b5bef01373a3cdbd50c2562b763fc96cbde4502352",
          "stableId": "surgery-procedure:respiratory-thoracic:lobectomy"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "lobectomy"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "lung lobe removal"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "lung lobectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "VATS lobectomy"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "robotic lung lobectomy"
          }
        ],
        "whyItMatters": "A chest tube maintains pleural pressure conditions needed for the remaining lung to expand. Pain control protects ventilation because splinting and shallow breaths promote atelectasis and pneumonia. Rapid bright-red drainage may represent life-threatening intrathoracic hemorrhage. New atrial arrhythmia is common enough to watch for but still requires assessment of stability and causes."
      },
      {
        "abbreviations": [],
        "aliases": [
          "renal transplant",
          "kidney transplant",
          "renal transplantation",
          "living donor kidney transplant",
          "deceased donor kidney transplant"
        ],
        "browse": {
          "branchId": "transplant",
          "branchIds": [
            "transplant",
            "renal-urologic",
            "perioperative-care"
          ],
          "label": "Transplant Procedures"
        },
        "category": "Surgeries & Procedures / Transplant Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Chronic kidney disease",
            "id": "surgery-procedure:transplant:kidney-transplantation:link:1",
            "label": "Chronic kidney disease",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:transplant:kidney-transplantation",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "End-stage renal disease",
            "id": "surgery-procedure:transplant:kidney-transplantation:link:2",
            "label": "End-stage renal disease",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:transplant:kidney-transplantation",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:transplant:kidney-transplantation",
        "displayName": "Kidney transplantation (renal transplant)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Kidney transplantation",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:transplant:kidney-transplantation",
        "name": "Kidney transplantation",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "transplant",
            "renal-urologic",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "open",
              "transplant"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "elective",
              "urgent"
            ]
          },
          "pilotSequence": 15,
          "primaryBranchId": "transplant",
          "safetyVisibleSectionIds": [
            "positioning-and-activity"
          ],
          "supplementalRequested": false
        },
        "quickAnswer": "Kidney transplantation places a healthy donor kidney into a person with kidney failure and connects it to blood vessels and the bladder. It can restore filtration and reduce dialysis dependence, but lifelong immunosuppression and surveillance are needed because rejection, infection, vascular problems, obstruction, and medication toxicity can threaten the graft and patient.",
        "relatedTopics": [
          "Chronic kidney disease",
          "End-stage renal disease"
        ],
        "searchTerms": [
          "deceased donor kidney transplant",
          "kidney transplant",
          "Kidney transplantation",
          "Kidney transplantation (renal transplant)",
          "living donor kidney transplant",
          "post kidney transplant nursing care",
          "renal transplant",
          "renal transplant rejection",
          "renal transplantation",
          "transplant immunosuppression"
        ],
        "sections": [
          {
            "content": "The donor kidney is usually placed in the lower pelvis rather than the original kidney location. Its renal artery and vein connect to pelvic vessels and its ureter connects to the bladder; native kidneys often remain unless a separate reason requires removal.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": [
              "End-stage kidney disease in a medically and psychosocially suitable candidate after multidisciplinary evaluation.",
              "A kidney may come from a living or deceased donor; compatibility, infection/cancer screening, vascular anatomy, adherence capacity, and organ availability guide candidacy and timing."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Under anesthesia, the donor kidney is implanted in the pelvis, vascular connections restore blood flow, and the ureter is joined to the bladder, sometimes over a temporary stent. Immunosuppression prevents immune attack; urine may begin promptly or delayed graft function may require temporary dialysis.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Verify recipient identity and organ/crossmatch process, baseline weight, blood pressure, volume status, dialysis timing/access, urine output, electrolytes, infection symptoms, skin, cardiopulmonary status, allergies, psychosocial supports, and medication/adherence teaching. Medication changes must be directed by the transplant, anesthesia, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Explain the graft location, lines/catheter, frequent urine and laboratory monitoring, pain and mobility plan, immunosuppression, infection prevention, rejection warning signs, follow-up intensity, and possibility of delayed function. Avoid promising immediate urine production or dialysis independence.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "The transplant team explains graft failure, rejection, infection, bleeding/thrombosis, urine leak or obstruction, drug toxicity, malignancy risk, delayed function, donor-specific issues, and alternatives including dialysis. The nurse verifies consent and organ/recipient checks, allergies, infection screen, interpreter/capacity support, and unresolved-question escalation.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Assess airway/circulation, graft-area pain/swelling, urine output and character at the ordered frequency, fluid balance, daily weight, blood pressure, electrolytes, creatinine trend, bleeding, infection, and distal perfusion. Administer immunosuppression on schedule and report oliguria/anuria rather than assuming delayed function.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "A urinary catheter enables precise output and protects the ureter connection; IV/central and arterial access, surgical drain, ureteral stent, dialysis access, and compression devices may be present. Maintain catheter patency without traction and preserve dialysis access until the transplant team confirms it is no longer needed.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Incisional pain and intensive monitoring are expected. Many grafts produce urine early, sometimes in large amounts requiring carefully matched fluid/electrolyte replacement; some have delayed function. Success is judged by clinical and laboratory trends, not urine volume alone.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": {
              "early": [
                "Hemorrhage, renal artery or vein thrombosis, urine leak/ureteral obstruction, acute rejection, delayed graft function, electrolyte/volume disturbance, infection, wound problem, lymphocele, and venous thromboembolism."
              ],
              "later": [
                "Chronic graft dysfunction/rejection, recurrent original disease, hypertension, diabetes and other drug toxicity, opportunistic infection, malignancy, cardiovascular disease, and adherence-related graft loss."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": [
              {
                "action": "Notify the transplant team immediately, assess catheter and hemodynamics under protocol, and prepare for urgent laboratory and graft-imaging evaluation.",
                "finding": "Sudden oliguria/anuria, abrupt graft-area pain/swelling, hematuria, hypotension, or rising creatinine/potassium",
                "why": "Vascular thrombosis, obstruction, leak, rejection, or poor perfusion can threaten graft viability."
              },
              {
                "action": "Contact the transplant team promptly and obtain ordered infection evaluation while following precautions.",
                "finding": "Fever, chills, cough, dysuria, wound change, diarrhea, confusion, or unexplained weakness",
                "why": "Immunosuppression can blunt typical infection signs while allowing rapid progression."
              },
              {
                "action": "Escalate volume, renal, medication, and hypertensive-emergency assessment.",
                "finding": "Rapid weight gain, edema, dyspnea, severe hypertension, or neurologic change",
                "why": "Graft dysfunction and fluid/electrolyte imbalance can cause pulmonary edema or neurologic/cardiac injury."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Protect the lower-abdominal graft incision and catheter, turn and walk early with assistance, and use clot/fall precautions. Avoid direct pressure or trauma to the graft area and follow transplant-specific lifting and activity limits.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Measure intake and urine closely and replace fluid/electrolytes only under transplant orders; needs can change rapidly with high urine output or delayed function. Teach food safety and individualized sodium, potassium, glucose, and hydration guidance based on graft and medication effects.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Use ordered analgesia while monitoring sedation, respiratory function, kidney function, and medication interactions. Reassess graft-area pain with urine and hemodynamic trends; sudden or escalating localized pain requires evaluation for vascular, urinary, or rejection problems.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Teach exact immunosuppressant timing, laboratory/drug-level visits, infection and food safety, blood pressure/weight/temperature monitoring, hydration plan, skin/cancer prevention, interaction checks, and never running out of medicines. Contact the transplant team for reduced urine, fever, graft pain, vomiting/diarrhea affecting medicines, swelling, or missed doses.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": "Use GRAFT: Graft urine/creatinine trend, Rejection and infection cues, Anti-rejection medicines exactly on time, Fluid/electrolyte balance, and Teaching/follow-up. GRAFT is an organizer; transplant-center protocols govern targets and actions.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": [
              "Sudden loss of urine can reflect a time-sensitive vascular or urinary complication, not simply dehydration.",
              "Immunosuppression protects the graft but increases infection, metabolic, toxicity, and malignancy risks.",
              "A patient can reject a graft with subtle symptoms, so laboratory and follow-up adherence are essential.",
              "The transplanted kidney is usually in the pelvis, which explains incision location and the need to protect that area."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          },
          {
            "content": {
              "commonMisconception": "A functioning transplant does not eliminate chronic follow-up or all future dialysis risk.",
              "immediateActionFinding": "Abrupt oliguria/anuria with graft pain or instability.",
              "mostImportantComplication": "Graft vascular thrombosis or acute rejection/infection.",
              "patientTeaching": "Never miss immunosuppression or follow-up; report fever, reduced urine, graft pain, or inability to retain medicines.",
              "positioningPrecaution": "Protect the pelvic graft and urinary catheter while mobilizing early.",
              "priorityAssessment": "Urine/creatinine and fluid trend, graft pain/swelling, hemodynamics, electrolytes, bleeding, infection, and medication timing."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "niddk-kidney-transplant",
              "nlm-kidney-transplant"
            ]
          }
        ],
        "sourceKeys": [
          "niddk-kidney-transplant",
          "nlm-kidney-transplant"
        ],
        "sourceNote": "Reviewed nursing synthesis of NLM and NIDDK kidney-transplant guidance; immunosuppression, fluid replacement, graft targets, and dialysis decisions are transplant-center specific.",
        "studentFacing": true,
        "summary": "Kidney transplantation places a healthy donor kidney into a person with kidney failure and connects it to blood vessels and the bladder. It can restore filtration and reduce dialysis dependence, but lifelong immunosuppression and surveillance are needed because rejection, infection, vascular problems, obstruction, and medication toxicity can threaten the graft and patient.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_PILOT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "0e2ae4a5bc7e130b3a4e73a92c3338e50c8aad2c3891245e3986a74b7dace659",
          "stableId": "surgery-procedure:transplant:kidney-transplantation"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "renal transplant"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "kidney transplant"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "renal transplantation"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "living donor kidney transplant"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "deceased donor kidney transplant"
          }
        ],
        "whyItMatters": "Sudden loss of urine can reflect a time-sensitive vascular or urinary complication, not simply dehydration. Immunosuppression protects the graft but increases infection, metabolic, toxicity, and malignancy risks. A patient can reject a graft with subtle symptoms, so laboratory and follow-up adherence are essential. The transplanted kidney is usually in the pelvis, which explains incision location and the need to protect that area."
      },
      {
        "abbreviations": [
          "SEEG"
        ],
        "aliases": [
          "SEEG",
          "stereo EEG",
          "stereotactic EEG",
          "depth electrode monitoring",
          "intracranial depth EEG"
        ],
        "browse": {
          "branchId": "neurologic-neurosurgery",
          "branchIds": [
            "neurologic-neurosurgery",
            "perioperative-care"
          ],
          "label": "Neurologic and Neurosurgical Procedures"
        },
        "category": "Surgeries & Procedures / Neurologic and Neurosurgical Procedures",
        "commonMisspellings": [],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Epilepsy",
            "id": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography:link:1",
            "label": "Epilepsy",
            "relationshipType": "evaluates-condition",
            "sourceId": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "EEG",
            "id": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography:link:2",
            "label": "EEG",
            "relationshipType": "related-procedure",
            "sourceId": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ],
            "targetCollection": "clinicalReferenceEntries"
          }
        ],
        "directTargetId": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "displayName": "Stereoelectroencephalography (SEEG)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Stereoelectroencephalography",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "name": "Stereoelectroencephalography",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "neurologic-neurosurgery",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "stereotactic",
              "minimally-invasive"
            ],
            "intents": [
              "diagnostic"
            ],
            "urgency": [
              "elective"
            ]
          },
          "pilotSequence": null,
          "primaryBranchId": "neurologic-neurosurgery",
          "safetyVisibleSectionIds": [
            "pain-management",
            "positioning-and-activity"
          ],
          "supplementalRequested": true
        },
        "quickAnswer": "Stereoelectroencephalography (SEEG) uses multiple thin electrodes placed through small skull openings to record electrical activity from targeted deep and surface brain regions over several days. Its purpose is to locate where drug-resistant seizures begin and determine whether a safer, effective epilepsy treatment is possible.",
        "relatedTopics": [
          "Epilepsy",
          "EEG"
        ],
        "searchTerms": [
          "depth electrode monitoring",
          "epilepsy depth electrodes",
          "intracranial depth EEG",
          "invasive seizure monitoring",
          "SEEG",
          "SEEG nursing care",
          "stereo EEG",
          "Stereoelectroencephalography",
          "Stereoelectroencephalography (SEEG)",
          "stereoencephalography",
          "stereotactic EEG"
        ],
        "sections": [
          {
            "content": "Each electrode follows a planned three-dimensional path through scalp and skull into selected brain regions. Planning avoids major vessels and samples networks suspected of starting or spreading seizures; function mapping may also show areas that must be protected.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": [
              "Evaluate drug-resistant focal epilepsy when noninvasive EEG, imaging, and clinical findings do not localize the seizure network well enough for treatment planning.",
              "Clarify whether resection, ablation, neuromodulation, or no destructive procedure offers an acceptable balance of seizure benefit and neurologic risk."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Using stereotactic imaging/navigation, the neurosurgical team places depth electrodes through small twist-drill openings and secures them externally. In an epilepsy monitoring unit, antiseizure medicines may be adjusted only under protocol so habitual events can be recorded; electrodes may also deliver carefully controlled stimulation for functional mapping before removal.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Document seizure types, frequency, triggers, rescue plan, last events, baseline cognition/speech/strength/sensation, allergies, infection or skin issues, pregnancy status when relevant, imaging/labs, psychosocial support, and medication reconciliation. Medication changes must be directed by the epilepsy, neurosurgery, anesthesia, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Explain electrode placement/removal, head dressing and cables, continuous video-EEG, limited mobility with assisted toileting, seizure precautions, repeated neurologic checks, event-button use, possible protocol-directed medicine reduction, stimulation sensations, and that SEEG is a diagnostic pathway rather than a guaranteed cure.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "The specialists explain bleeding, infection, stroke, edema, neurologic deficit, seizure/status epilepticus, inaccurate localization, additional procedures, and alternatives. The nurse verifies procedural and monitoring consent, identity, planned evaluation, baseline neurologic status, allergies, interpreter/capacity support, and escalation of unanswered questions.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "disclosure",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Assess airway/circulation and serial consciousness, pupils, speech, strength, sensation, headache, nausea/vomiting, dressing/electrode sites, seizure activity, and pain. Confirm lead security and monitoring connection, then maintain continuous observation and individualized seizure/fall precautions.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Multiple intracranial electrodes connect by external leads to a video-EEG system. IV access and compression devices may be present; urinary devices are selective. Keep leads labeled, secured, dry, and free from traction, and never disconnect, reposition, or manipulate them outside the monitoring protocol.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Mild headache, scalp tenderness, fatigue, and restricted mobility may occur. The patient should remain at neurologic baseline between planned events, electrode sites should remain dry without expanding swelling, and recordings should remain technically intact.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": {
              "early": [
                "Intracranial or tract hemorrhage, stroke, cerebral edema, infection, cerebrospinal-fluid leak, new neurologic deficit, lead displacement/damage, prolonged seizure or status epilepticus, fall, and aspiration."
              ],
              "later": [
                "Delayed infection or hemorrhage, persistent neurologic deficit, wound problem, and an inconclusive localization requiring further evaluation."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": [
              {
                "action": "Activate urgent neurologic/neurosurgical evaluation and support airway/ventilation while preparing for ordered imaging.",
                "finding": "New weakness, speech/vision change, unequal pupils, declining consciousness, repeated vomiting, or severe escalating headache",
                "why": "Electrode-path hemorrhage, edema, or stroke can be time-sensitive."
              },
              {
                "action": "Protect the patient, time and characterize the event, support airway/oxygenation, and follow the prescribed rescue protocol immediately.",
                "finding": "Seizure exceeds the individualized rescue threshold, repeats without recovery, impairs airway, or differs substantially from baseline",
                "why": "Medication adjustment and monitoring can increase seizure risk, including status epilepticus and aspiration."
              },
              {
                "action": "Notify epilepsy/neurosurgery staff promptly; protect the system and do not manipulate intracranial hardware.",
                "finding": "Fever, increasing site redness/drainage, clear leakage, loose/broken lead, or loss of monitoring connection",
                "why": "Infection, cerebrospinal-fluid leak, or data loss can endanger the patient and invalidate the diagnostic study."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Use the ordered head position and protect leads from pressure or traction. Mobility and toileting require staff assistance under the monitoring-unit protocol; use seizure and fall precautions and keep the patient within camera/EEG coverage.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Confirm alertness and swallowing safety after placement and after seizures before intake. Monitor hydration, urine, bowel function, nausea, and aspiration risk; supervise meals when the seizure plan requires it.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Use ordered analgesia that preserves neurologic assessment and respiratory safety. Reassess headache character, cognition, pupils, motor/speech findings, and sites; a worsening headache with neurologic or vomiting changes needs urgent evaluation.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "After electrode removal, teach site care, prescribed antiseizure medicines, activity and bathing limits, seizure safety, follow-up for results/treatment planning, and emergency symptoms. Seek urgent care for new neurologic deficit, prolonged seizure, fever, drainage, severe worsening headache, repeated vomiting, or confusion.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": "Use DEPTH: Deficit checks, Electrode/connection security, Prolonged-seizure rescue plan, Traction/fall prevention, and Headache/infection surveillance. DEPTH organizes bedside safety but does not replace the patient's ordered seizure thresholds.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": [
              "SEEG samples seizure networks that scalp EEG may not localize precisely enough for safe treatment.",
              "A new focal deficit or severe headache can indicate electrode-related hemorrhage and requires urgent action.",
              "Continuous connection and exact event documentation determine whether the invasive study produces usable localization data.",
              "SEEG can guide resection, ablation, stimulation, or a decision not to remove tissue; it is not itself curative treatment."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          },
          {
            "content": {
              "commonMisconception": "SEEG is invasive diagnostic monitoring, not a treatment that directly stops epilepsy.",
              "immediateActionFinding": "New focal deficit or seizure beyond the rescue threshold.",
              "mostImportantComplication": "Intracranial hemorrhage or status epilepticus.",
              "patientTeaching": "SEEG localizes seizures for treatment planning; report neurologic change, fever, drainage, or severe headache.",
              "positioningPrecaution": "Protect all leads from traction and maintain ordered head position/continuous monitoring.",
              "priorityAssessment": "Serial neurologic status, seizure/rescue threshold, electrode sites and connections, airway/aspiration, and fall safety."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "ninds-epilepsy-seeg",
              "pubmed-seeg-review"
            ]
          }
        ],
        "sourceKeys": [
          "ninds-epilepsy-seeg",
          "pubmed-seeg-review"
        ],
        "sourceNote": "Reviewed nursing synthesis of NINDS epilepsy guidance and peer-reviewed SEEG evidence; electrode targets, medicine adjustment, stimulation, rescue thresholds, and mobility follow the specialist unit protocol.",
        "studentFacing": true,
        "summary": "Stereoelectroencephalography (SEEG) uses multiple thin electrodes placed through small skull openings to record electrical activity from targeted deep and surface brain regions over several days. Its purpose is to locate where drug-resistant seizures begin and determine whether a safer, effective epilepsy treatment is possible.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_SUPPLEMENT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "a81c48babed75dce4c0b510399f89c9d4118a779cae266c0dfb3656e7c5e78f3",
          "stableId": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "SEEG"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "stereo EEG"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "stereotactic EEG"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "depth electrode monitoring"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "intracranial depth EEG"
          }
        ],
        "whyItMatters": "SEEG samples seizure networks that scalp EEG may not localize precisely enough for safe treatment. A new focal deficit or severe headache can indicate electrode-related hemorrhage and requires urgent action. Continuous connection and exact event documentation determine whether the invasive study produces usable localization data. SEEG can guide resection, ablation, stimulation, or a decision not to remove tissue; it is not itself curative treatment."
      },
      {
        "abbreviations": [
          "SB tube"
        ],
        "aliases": [
          "Sengstaken-Blakemore tube",
          "SB tube",
          "Blakemore tube",
          "esophageal balloon tamponade",
          "variceal balloon tamponade",
          "Sengstaken Blackmore tube"
        ],
        "browse": {
          "branchId": "gastrointestinal-general",
          "branchIds": [
            "gastrointestinal-general",
            "trauma-emergency",
            "perioperative-care"
          ],
          "label": "Gastrointestinal and General Surgery"
        },
        "category": "Surgeries & Procedures / Gastrointestinal and General Surgery",
        "commonMisspellings": [
          "Sengstaken Blackmore tube"
        ],
        "crossLinkRecords": [
          {
            "canonicalTitle": "Esophageal varices",
            "id": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube:link:1",
            "label": "Esophageal varices",
            "relationshipType": "treats-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ],
            "targetCollection": "pathologyDiseases"
          },
          {
            "canonicalTitle": "Portal hypertension",
            "id": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube:link:2",
            "label": "Portal hypertension",
            "relationshipType": "associated-condition",
            "sourceId": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ],
            "targetCollection": "pathologyDiseases"
          }
        ],
        "directTargetId": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "displayName": "Sengstaken-Blakemore tube (emergency variceal balloon tamponade)",
        "encyclopediaDomains": [
          "surgeries-procedures"
        ],
        "encyclopediaSection": "surgeries-procedures",
        "fullForm": "Sengstaken-Blakemore tube placement",
        "hidden": false,
        "icon": "SU",
        "id": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "name": "Sengstaken-Blakemore tube placement",
        "nclexEssential": true,
        "primaryDomain": "Surgeries & Procedures",
        "procedure": {
          "browseBranchIds": [
            "gastrointestinal-general",
            "trauma-emergency",
            "perioperative-care"
          ],
          "classification": {
            "approaches": [
              "minimally-invasive"
            ],
            "intents": [
              "therapeutic"
            ],
            "urgency": [
              "emergent"
            ]
          },
          "pilotSequence": null,
          "primaryBranchId": "gastrointestinal-general",
          "safetyVisibleSectionIds": [
            "consent-and-nursing-responsibility"
          ],
          "supplementalRequested": true
        },
        "quickAnswer": "A Sengstaken-Blakemore tube is a high-risk emergency device whose gastric and esophageal balloons can compress bleeding varices near the stomach and lower esophagus. It is only a temporary bridge when massive variceal hemorrhage is uncontrolled and definitive endoscopic or interventional treatment is unavailable, delayed, or unsuccessful.",
        "relatedTopics": [
          "Esophageal varices",
          "Portal hypertension"
        ],
        "searchTerms": [
          "balloon tamponade monitoring",
          "Blakemore tube",
          "esophageal balloon tamponade",
          "esophageal varices balloon",
          "massive variceal bleed tube",
          "SB tube",
          "SB tube nursing care",
          "Sengstaken Blackmore tube",
          "Sengstaken-Blakemore tube",
          "Sengstaken-Blakemore tube (emergency variceal balloon tamponade)",
          "Sengstaken-Blakemore tube placement",
          "variceal balloon tamponade"
        ],
        "sections": [
          {
            "content": "Portal hypertension can enlarge fragile veins in the distal esophagus and upper stomach. The tube passes through the mouth into the stomach; its gastric balloon anchors below the gastroesophageal junction, and its esophageal balloon may compress distal esophageal varices. The tube's gastric port drains blood, but the classic device has no dedicated esophageal-suction port.",
            "id": "anatomy-involved",
            "label": "Anatomy involved",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": [
              "Temporarily control life-threatening esophageal variceal bleeding when recommended medical and endoscopic therapy cannot control bleeding or is not immediately available.",
              "Stabilize the patient long enough to reach definitive endoscopy, transjugular intrahepatic portosystemic shunt (TIPS), or another specialist intervention; it is not routine first-line or definitive therapy."
            ],
            "id": "why-performed",
            "label": "Why it is performed",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "A trained emergency, critical-care, gastrointestinal, or surgical team places the tube after airway protection and confirms that the gastric balloon is in the stomach before inflation. Ordered balloon inflation and traction press the gastric balloon against the junction; the esophageal balloon is used only when the specialist protocol requires it. Suction and continuous monitoring help assess ongoing bleeding while definitive care is arranged.",
            "id": "how-it-works",
            "label": "How the procedure works",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "Treat this as active hemorrhagic shock preparation: assess airway/aspiration risk, work of breathing, mental status, hemodynamics, hematemesis/melena, perfusion, urine output, blood count/coagulation/fibrinogen, type and crossmatch, liver and kidney function, and prior esophageal surgery/stricture or recent endoscopic therapy. Medication changes must be directed by the emergency, critical-care, gastrointestinal, anesthesia, or prescribing clinician.",
            "id": "preoperative-nursing-assessment",
            "label": "Preoperative nursing assessment",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "When the patient's condition permits, explain that the tube temporarily compresses bleeding while specialists arrange definitive therapy, that endotracheal intubation and sedation are usually required, and that continuous critical-care monitoring is essential. In a true emergency, use brief direct explanations and update the surrogate according to consent law and policy.",
            "id": "preoperative-patient-teaching",
            "label": "Preoperative patient teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "The placing clinician explains the emergency indication, airway protection, perforation, aspiration, mucosal necrosis, airway obstruction, recurrent bleeding, and alternatives when time permits. The nurse verifies identity, emergency-consent pathway, allergies, blood availability, team roles, labeled ports, suction, pressure-monitoring equipment, and an immediately accessible emergency-deflation plan.",
            "id": "consent-and-nursing-responsibility",
            "label": "Informed consent and nursing responsibility",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "Continuously monitor airway/ventilator status, oxygenation, hemodynamics, mental status, tube depth/marking and securement, ordered balloon pressures/volumes, traction, gastric drainage and ongoing blood loss, laboratory trends, transfusion response, urine output, skin/mucosal pressure, and progress toward definitive treatment. One-to-one critical-care observation may be required by local policy.",
            "id": "immediate-postoperative-priorities",
            "label": "Immediate postoperative priorities",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "The classic tube has gastric and esophageal balloon ports plus a gastric aspiration port; a separate tube may drain secretions above the esophageal balloon under specialist protocol. Keep every port clearly labeled and capped or connected exactly as ordered. Suction, manometer, airway equipment, scissors or the approved rapid-deflation tool, blood products, and resuscitation equipment must be immediately available.",
            "id": "tubes-drains-devices",
            "label": "Tubes, drains, devices, and equipment",
            "presentation": "disclosure",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "If tamponade is effective, fresh blood in gastric drainage and hemodynamic instability should lessen while resuscitation continues. The patient is generally intubated and sedated, tube position and pressure remain stable, and definitive therapy is actively pending. Continued brisk bleeding, new respiratory change, chest pain, or tube migration is not expected.",
            "id": "expected-findings",
            "label": "Expected findings",
            "presentation": "disclosure",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": {
              "early": [
                "Aspiration, airway obstruction from balloon/tube migration, esophageal or gastric rupture, mucosal ulceration or necrosis, recurrent or uncontrolled hemorrhage, hypoxia, pressure injury, tube malposition, and cardiopulmonary arrest."
              ],
              "later": [
                "Rebleeding after deflation/removal, aspiration pneumonia, esophageal stricture, fistula, infection, and complications of the underlying portal hypertension or liver failure."
              ]
            },
            "id": "complications",
            "label": "Early and later complications",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": [
              {
                "action": "Activate the airway emergency response and follow the bedside rapid-deflation/removal protocol immediately while supporting oxygenation.",
                "finding": "Sudden hypoxemia, high airway pressure, loss of ventilation, proximal tube migration, or balloon visible in the mouth",
                "why": "A migrated inflated balloon can obstruct the airway and cause fatal asphyxia."
              },
              {
                "action": "Escalate catastrophic perforation or recurrent hemorrhage response immediately and prepare emergency imaging, endoscopy, interventional radiology, or surgery.",
                "finding": "Sudden severe chest/upper abdominal pain, new subcutaneous emphysema, hemodynamic collapse, or massive recurrent hematemesis",
                "why": "Balloon pressure or malposition can rupture the esophagus or stomach, and loss of tamponade can cause exsanguination."
              },
              {
                "action": "Notify the definitive-treatment team immediately and continue the massive-hemorrhage pathway.",
                "finding": "Increasing fresh blood despite correct system setup, rising vasopressor/transfusion need, or worsening shock",
                "why": "Balloon tamponade can fail and must never delay endoscopy, TIPS, or other definitive hemostasis."
              }
            ],
            "id": "report-or-escalate-immediately",
            "label": "Report or escalate immediately",
            "presentation": "urgent",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "Maintain the ordered head elevation and airway position, strict bed rest, secure traction setup, and pressure-injury prevention. Reposition only with enough trained staff to protect the airway, tube depth, all ports, and traction; the patient must never ambulate with the device.",
            "id": "positioning-and-activity",
            "label": "Positioning and activity",
            "presentation": "disclosure",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "No oral intake is given while the airway is secured and balloon tamponade is active; nutrition and fluid management follow the critical-care hemorrhage plan. Measure gastric loss, urine output, transfusions, and resuscitation fluids, and monitor glucose/electrolytes and stool for evidence of continued bleeding.",
            "id": "diet-and-elimination",
            "label": "Diet and elimination",
            "presentation": "disclosure",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "Provide ordered sedation and analgesia appropriate for an intubated, critically ill patient while maintaining hemodynamic and neurologic assessment. New chest pain, agitation, ventilator change, or breakthrough distress requires immediate tube/airway/bleeding assessment rather than sedation escalation alone.",
            "id": "pain-management",
            "label": "Pain management",
            "presentation": "disclosure",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "The device is removed in a monitored setting and is not managed at home. After stabilization, teaching focuses on the definitive variceal treatment, portal-hypertension and liver-disease management, prescribed medicines, alcohol avoidance when relevant, follow-up endoscopy/hepatology, and emergency response to hematemesis, black stool, fainting, confusion, or weakness.",
            "id": "discharge-teaching",
            "label": "Discharge teaching",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": "Use BALLOON: Breathing protected, Apparatus depth/pressure secure, Losses and labs trended, Look for migration/perforation, Ongoing bleed reassessed, Organize definitive therapy, and Necessary deflation tool at bedside. This safety cue never substitutes for the specialist protocol.",
            "id": "nursing-memory-aids",
            "label": "Nursing memory aids",
            "presentation": "disclosure",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": [
              "The device can temporarily stop exsanguinating variceal bleeding, but rebleeding is common and definitive therapy cannot be delayed.",
              "Airway protection comes first because active hematemesis and balloon migration can cause aspiration or complete obstruction.",
              "Confirming gastric position before inflation matters because inflating a balloon in the esophagus can rupture it.",
              "Continuous pressure, position, bleeding, and perfusion surveillance is essential because benefit and catastrophic harm can both change within minutes."
            ],
            "id": "why-it-matters",
            "label": "Why it matters",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          },
          {
            "content": {
              "commonMisconception": "Sengstaken-Blakemore tamponade is not routine first-line therapy and must not delay definitive endoscopy or TIPS.",
              "immediateActionFinding": "Sudden ventilation failure or proximal balloon migration.",
              "mostImportantComplication": "Airway obstruction, perforation, or recurrent massive hemorrhage.",
              "patientTeaching": "This is a temporary critical-care bridge, not a take-home device or final variceal treatment.",
              "positioningPrecaution": "Head position and strict bed rest under the protocol; protect traction and all ports during any turn.",
              "priorityAssessment": "Protected airway, oxygenation, hemodynamics, tube position/balloon monitoring, drainage and ongoing blood loss, and definitive-care readiness."
            },
            "id": "nclex-and-exam-focus",
            "label": "NCLEX and nursing exam focus",
            "presentation": "essential",
            "sourceKeys": [
              "aasld-variceal-hemorrhage",
              "ncbi-sengstaken-blakemore"
            ]
          }
        ],
        "sourceKeys": [
          "aasld-variceal-hemorrhage",
          "ncbi-sengstaken-blakemore"
        ],
        "sourceNote": "Reviewed nursing synthesis of AASLD specialty guidance and the NCBI clinical review; exact airway, placement-confirmation, balloon, pressure, traction, suction, deflation, and duration steps follow the trained specialist team's device-specific protocol.",
        "studentFacing": true,
        "summary": "A Sengstaken-Blakemore tube is a high-risk emergency device whose gastric and esophageal balloons can compress bleeding varices near the stomach and lower esophagus. It is only a temporary bridge when massive variceal hemorrhage is uncontrolled and definitive endoscopic or interventional treatment is unavailable, delayed, or unsuccessful.",
        "surgeryProcedure": {
          "architectureVersion": "ani-surgery-procedures-domain-v1",
          "canonicalOwner": "Surgeries & Procedures",
          "generatorVersion": "ani-surgery-procedures-generator-v1",
          "reviewDueAt": "2027-08-08",
          "reviewedAt": "2026-08-08",
          "reviewStatus": "REVIEWED_SUPPLEMENT",
          "runtimeCollection": "clinicalReferenceEntries",
          "schemaVersion": "ani-surgery-procedures-runtime-v1",
          "sourceEntrySha256": "f3f9678eec01966360e2260ebc0a781488e7be3985fd58f1cb308d2f4e866912",
          "stableId": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube"
        },
        "type": "procedure",
        "typedAliases": [
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "Sengstaken-Blakemore tube"
          },
          {
            "identity": true,
            "kind": "abbreviation",
            "value": "SB tube"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "Blakemore tube"
          },
          {
            "identity": true,
            "kind": "alternative-name",
            "value": "esophageal balloon tamponade"
          },
          {
            "identity": true,
            "kind": "common-language",
            "value": "variceal balloon tamponade"
          },
          {
            "identity": true,
            "kind": "common-misspelling",
            "value": "Sengstaken Blackmore tube"
          }
        ],
        "whyItMatters": "The device can temporarily stop exsanguinating variceal bleeding, but rebleeding is common and definitive therapy cannot be delayed. Airway protection comes first because active hematemesis and balloon migration can cause aspiration or complete obstruction. Confirming gastric position before inflation matters because inflating a balloon in the esophagus can rupture it. Continuous pressure, position, bleeding, and perfusion surveillance is essential because benefit and catastrophic harm can both change within minutes."
      }
    ];
  const database = {
    schemaVersion: "ani-surgery-procedures-runtime-v1",
    sourceSchemaVersion: "ani-surgery-procedures-catalog-v1",
    architectureVersion: "ani-surgery-procedures-domain-v1",
    generatorVersion: "ani-surgery-procedures-generator-v1",
    catalogVersion: "ani-surgery-procedures-pilot-v1.0.0",
    architectureSha256,
    architectureStatus: "APPROVED",
    pilotPublicationEnabled: true,
    massExpansionEnabled: false,
    status: {
      "aiCalls": 0,
      "architectureStatus": "APPROVED",
      "crossLinkRecordCount": 25,
      "massExpansionEnabled": false,
      "pilotCount": 15,
      "pilotPublicationEnabled": true,
      "sourceEntryCount": 17,
      "supplementalCount": 2
    },
    architecture: core.architectureDefinition(),
    entries,
    clinicalReferenceEntries: entries,
    crossLinkRecords: [
      {
        "canonicalTitle": "Coronary artery disease",
        "id": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting:link:1",
        "label": "Coronary artery disease",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "sourceKeys": [
          "aha-revascularization",
          "nlm-cabg"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Coronary artery disease",
        "id": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent:link:1",
        "label": "Coronary artery disease",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "sourceKeys": [
          "aha-revascularization",
          "nlm-pci"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Cholecystitis",
        "id": "surgery-procedure:gastrointestinal-general:cholecystectomy:link:1",
        "label": "Cholecystitis",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "sourceKeys": [
          "nlm-cholecystectomy",
          "sages-cholecystectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Cholelithiasis",
        "id": "surgery-procedure:gastrointestinal-general:cholecystectomy:link:2",
        "label": "Cholelithiasis",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "sourceKeys": [
          "nlm-cholecystectomy",
          "sages-cholecystectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Appendicitis",
        "id": "surgery-procedure:gastrointestinal-general:appendectomy:link:1",
        "label": "Appendicitis",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:appendectomy",
        "sourceKeys": [
          "acs-appendectomy",
          "nlm-appendectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Colorectal cancer",
        "id": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy:link:1",
        "label": "Colorectal cancer",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "sourceKeys": [
          "ascrs-ostomy",
          "nlm-colectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Crohn disease",
        "id": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy:link:2",
        "label": "Crohn disease",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "sourceKeys": [
          "ascrs-ostomy",
          "nlm-colectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Ulcerative colitis",
        "id": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy:link:3",
        "label": "Ulcerative colitis",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "sourceKeys": [
          "ascrs-ostomy",
          "nlm-colectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Thyroid cancer",
        "id": "surgery-procedure:endocrine:thyroidectomy:link:1",
        "label": "Thyroid cancer",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:endocrine:thyroidectomy",
        "sourceKeys": [
          "ata-thyroid-surgery",
          "nlm-thyroidectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Hyperthyroidism",
        "id": "surgery-procedure:endocrine:thyroidectomy:link:2",
        "label": "Hyperthyroidism",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:endocrine:thyroidectomy",
        "sourceKeys": [
          "ata-thyroid-surgery",
          "nlm-thyroidectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Osteoarthritis",
        "id": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty:link:1",
        "label": "Osteoarthritis",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "sourceKeys": [
          "aaos-hip-replacement",
          "nlm-hip-replacement"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Osteoarthritis",
        "id": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty:link:1",
        "label": "Osteoarthritis",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "sourceKeys": [
          "aaos-knee-replacement",
          "nlm-knee-replacement"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Brain tumor",
        "id": "surgery-procedure:neurologic-neurosurgery:craniotomy:link:1",
        "label": "Brain tumor",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "sourceKeys": [
          "aans-craniotomy",
          "nlm-craniotomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Epilepsy",
        "id": "surgery-procedure:neurologic-neurosurgery:craniotomy:link:2",
        "label": "Epilepsy",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "sourceKeys": [
          "aans-craniotomy",
          "nlm-craniotomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Cauda equina syndrome",
        "id": "surgery-procedure:neurologic-neurosurgery:laminectomy:link:1",
        "label": "Cauda equina syndrome",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "sourceKeys": [
          "aans-lumbar-stenosis",
          "nlm-laminectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Benign prostatic hyperplasia",
        "id": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate:link:1",
        "label": "Benign prostatic hyperplasia",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "sourceKeys": [
          "niddk-bph-treatment",
          "nlm-turp"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Endometrial cancer",
        "id": "surgery-procedure:reproductive-gynecologic:hysterectomy:link:1",
        "label": "Endometrial cancer",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "sourceKeys": [
          "acog-hysterectomy",
          "nlm-hysterectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Breast cancer",
        "id": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy:link:1",
        "label": "Breast cancer",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "sourceKeys": [
          "nci-breast-surgery",
          "nlm-mastectomy"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Lung cancer",
        "id": "surgery-procedure:respiratory-thoracic:lobectomy:link:1",
        "label": "Lung cancer",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:respiratory-thoracic:lobectomy",
        "sourceKeys": [
          "acs-lung-surgery",
          "nlm-lung-surgery"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Chronic kidney disease",
        "id": "surgery-procedure:transplant:kidney-transplantation:link:1",
        "label": "Chronic kidney disease",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:transplant:kidney-transplantation",
        "sourceKeys": [
          "niddk-kidney-transplant",
          "nlm-kidney-transplant"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "End-stage renal disease",
        "id": "surgery-procedure:transplant:kidney-transplantation:link:2",
        "label": "End-stage renal disease",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:transplant:kidney-transplantation",
        "sourceKeys": [
          "niddk-kidney-transplant",
          "nlm-kidney-transplant"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Epilepsy",
        "id": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography:link:1",
        "label": "Epilepsy",
        "relationshipType": "evaluates-condition",
        "sourceId": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "sourceKeys": [
          "ninds-epilepsy-seeg",
          "pubmed-seeg-review"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "EEG",
        "id": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography:link:2",
        "label": "EEG",
        "relationshipType": "related-procedure",
        "sourceId": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "sourceKeys": [
          "ninds-epilepsy-seeg",
          "pubmed-seeg-review"
        ],
        "targetCollection": "clinicalReferenceEntries"
      },
      {
        "canonicalTitle": "Esophageal varices",
        "id": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube:link:1",
        "label": "Esophageal varices",
        "relationshipType": "treats-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "sourceKeys": [
          "aasld-variceal-hemorrhage",
          "ncbi-sengstaken-blakemore"
        ],
        "targetCollection": "pathologyDiseases"
      },
      {
        "canonicalTitle": "Portal hypertension",
        "id": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube:link:2",
        "label": "Portal hypertension",
        "relationshipType": "associated-condition",
        "sourceId": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "sourceKeys": [
          "aasld-variceal-hemorrhage",
          "ncbi-sengstaken-blakemore"
        ],
        "targetCollection": "pathologyDiseases"
      }
    ],
    indexes: {
      "byAlias": {
        "abdominal hysterectomy": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "angioplasty and stent": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "appendectamy": "surgery-procedure:gastrointestinal-general:appendectomy",
        "appendectomy": "surgery-procedure:gastrointestinal-general:appendectomy",
        "appendectomy appendix removal": "surgery-procedure:gastrointestinal-general:appendectomy",
        "appendicectomy": "surgery-procedure:gastrointestinal-general:appendectomy",
        "appendix removal": "surgery-procedure:gastrointestinal-general:appendectomy",
        "awake craniotomy": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "blakemore tube": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "bowel resection with colostomy": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "brain surgery": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "breast removal surgery": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "cabbage": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "cabg": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "cervical laminectomy": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "cholecystectemy": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "cholecystectomy": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "cholecystectomy gallbladder removal": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "colectomy large bowel removal sometimes with an ostomy": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "colectomy with possible ostomy": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "colectomy with stoma": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "colon resection": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "coronary angioplasty": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "coronary artery bypass grafting": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "coronary artery bypass grafting cabg": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "coronary artery bypass graphing": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "coronary artery bypass surgery": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "coronary bypass": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "coronary stent placement": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "cranial surgery": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "craniotamy": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "craniotomy": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "craniotomy temporary opening of the skull": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "deceased donor kidney transplant": "surgery-procedure:transplant:kidney-transplantation",
        "decompressive laminectomy": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "depth electrode monitoring": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "esophageal balloon tamponade": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "gallbladder removal": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "heart bypass surgery": "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
        "heart stent": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "hip arthroplasty": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "hip joint replacement": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "hip replacement": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "hysterectomy": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "hysterectomy uterus removal": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "intracranial depth eeg": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "kidney transplant": "surgery-procedure:transplant:kidney-transplantation",
        "kidney transplantation": "surgery-procedure:transplant:kidney-transplantation",
        "kidney transplantation renal transplant": "surgery-procedure:transplant:kidney-transplantation",
        "knee arthroplasty": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "knee joint replacement": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "knee replacement": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "lamina removal": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "laminectomy": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "laminectomy spinal decompression": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "lap chole": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "laparoscopic appendectomy": "surgery-procedure:gastrointestinal-general:appendectomy",
        "laparoscopic cholecystectomy": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "laparoscopic hysterectomy": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "large bowel resection": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "living donor kidney transplant": "surgery-procedure:transplant:kidney-transplantation",
        "lobectomy": "surgery-procedure:respiratory-thoracic:lobectomy",
        "lumbar laminectomy": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "lung lobe removal": "surgery-procedure:respiratory-thoracic:lobectomy",
        "lung lobectomy": "surgery-procedure:respiratory-thoracic:lobectomy",
        "mastectomy": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "mastectomy surgical breast removal": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "modified radical mastectomy": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "open appendectomy": "surgery-procedure:gastrointestinal-general:appendectomy",
        "open cholecystectomy": "surgery-procedure:gastrointestinal-general:cholecystectomy",
        "partial colectomy": "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
        "partial thyroidectomy": "surgery-procedure:endocrine:thyroidectomy",
        "pci": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "percutaneous coronary intervention": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "percutaneous coronary intervention with coronary stent": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "percutaneous coronary intervention with coronary stent pci": "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
        "prostate resection": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "prostate shaving procedure": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "pulmonary lobectomy": "surgery-procedure:respiratory-thoracic:lobectomy",
        "pulmonary lobectomy removal of one lung lobe": "surgery-procedure:respiratory-thoracic:lobectomy",
        "renal transplant": "surgery-procedure:transplant:kidney-transplantation",
        "renal transplantation": "surgery-procedure:transplant:kidney-transplantation",
        "robotic lung lobectomy": "surgery-procedure:respiratory-thoracic:lobectomy",
        "sb tube": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "seeg": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "sengstaken blackmore tube": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "sengstaken blakemore tube": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "sengstaken blakemore tube emergency variceal balloon tamponade": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "sengstaken blakemore tube placement": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "simple mastectomy": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "skin sparing mastectomy": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "skull opening surgery": "surgery-procedure:neurologic-neurosurgery:craniotomy",
        "spinal decompression": "surgery-procedure:neurologic-neurosurgery:laminectomy",
        "stereo eeg": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "stereoelectroencephalography": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "stereoelectroencephalography seeg": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "stereotactic eeg": "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
        "tha": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "thyroid lobectomy": "surgery-procedure:endocrine:thyroidectomy",
        "thyroid removal": "surgery-procedure:endocrine:thyroidectomy",
        "thyroid surgery": "surgery-procedure:endocrine:thyroidectomy",
        "thyroidectomy": "surgery-procedure:endocrine:thyroidectomy",
        "thyroidectomy partial or total thyroid removal": "surgery-procedure:endocrine:thyroidectomy",
        "tka": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "total hip arthroplasty": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "total hip arthroplasty total hip replacement": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "total hip replacement": "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
        "total hysterectomy": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "total knee arthroplasty": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "total knee arthroplasty total knee replacement": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "total knee replacement": "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
        "total mastectomy": "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
        "total thyroidectomy": "surgery-procedure:endocrine:thyroidectomy",
        "trans urethral resection": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "transurethral prostate surgery": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "transurethral resection of the prostate": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "transurethral resection of the prostate turp": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "turp": "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
        "uterus removal": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "vaginal hysterectomy": "surgery-procedure:reproductive-gynecologic:hysterectomy",
        "variceal balloon tamponade": "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
        "vats lobectomy": "surgery-procedure:respiratory-thoracic:lobectomy"
      },
      "byBranch": {
        "cardiovascular-vascular": [
          "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
          "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent"
        ],
        "dermatologic-plastic-reconstructive": [
          "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy"
        ],
        "endocrine": [
          "surgery-procedure:endocrine:thyroidectomy"
        ],
        "ent-head-neck": [
          "surgery-procedure:endocrine:thyroidectomy"
        ],
        "gastrointestinal-general": [
          "surgery-procedure:gastrointestinal-general:appendectomy",
          "surgery-procedure:gastrointestinal-general:cholecystectomy",
          "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
          "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube"
        ],
        "male-reproductive": [
          "surgery-procedure:male-reproductive:transurethral-resection-of-prostate"
        ],
        "neurologic-neurosurgery": [
          "surgery-procedure:neurologic-neurosurgery:craniotomy",
          "surgery-procedure:neurologic-neurosurgery:laminectomy",
          "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography"
        ],
        "ophthalmic": [],
        "orthopedic-musculoskeletal": [
          "surgery-procedure:neurologic-neurosurgery:laminectomy",
          "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
          "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty"
        ],
        "perioperative-care": [
          "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting",
          "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent",
          "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy",
          "surgery-procedure:endocrine:thyroidectomy",
          "surgery-procedure:gastrointestinal-general:appendectomy",
          "surgery-procedure:gastrointestinal-general:cholecystectomy",
          "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy",
          "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
          "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
          "surgery-procedure:neurologic-neurosurgery:craniotomy",
          "surgery-procedure:neurologic-neurosurgery:laminectomy",
          "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography",
          "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty",
          "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty",
          "surgery-procedure:reproductive-gynecologic:hysterectomy",
          "surgery-procedure:respiratory-thoracic:lobectomy",
          "surgery-procedure:transplant:kidney-transplantation"
        ],
        "renal-urologic": [
          "surgery-procedure:male-reproductive:transurethral-resection-of-prostate",
          "surgery-procedure:transplant:kidney-transplantation"
        ],
        "reproductive-gynecologic": [
          "surgery-procedure:reproductive-gynecologic:hysterectomy"
        ],
        "respiratory-thoracic": [
          "surgery-procedure:respiratory-thoracic:lobectomy"
        ],
        "transplant": [
          "surgery-procedure:transplant:kidney-transplantation"
        ],
        "trauma-emergency": [
          "surgery-procedure:gastrointestinal-general:appendectomy",
          "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube",
          "surgery-procedure:neurologic-neurosurgery:craniotomy"
        ]
      },
      "byId": {
        "surgery-procedure:cardiovascular-vascular:coronary-artery-bypass-grafting": 0,
        "surgery-procedure:cardiovascular-vascular:percutaneous-coronary-intervention-with-stent": 1,
        "surgery-procedure:dermatologic-plastic-reconstructive:mastectomy": 12,
        "surgery-procedure:endocrine:thyroidectomy": 5,
        "surgery-procedure:gastrointestinal-general:appendectomy": 3,
        "surgery-procedure:gastrointestinal-general:cholecystectomy": 2,
        "surgery-procedure:gastrointestinal-general:colectomy-with-possible-ostomy": 4,
        "surgery-procedure:gastrointestinal-general:sengstaken-blakemore-tube": 16,
        "surgery-procedure:male-reproductive:transurethral-resection-of-prostate": 10,
        "surgery-procedure:neurologic-neurosurgery:craniotomy": 8,
        "surgery-procedure:neurologic-neurosurgery:laminectomy": 9,
        "surgery-procedure:neurologic-neurosurgery:stereoelectroencephalography": 15,
        "surgery-procedure:orthopedic-musculoskeletal:total-hip-arthroplasty": 6,
        "surgery-procedure:orthopedic-musculoskeletal:total-knee-arthroplasty": 7,
        "surgery-procedure:reproductive-gynecologic:hysterectomy": 11,
        "surgery-procedure:respiratory-thoracic:lobectomy": 13,
        "surgery-procedure:transplant:kidney-transplantation": 14
      }
    },
    sourceReferences: [
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-cabg",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "review date stated on source page",
        "tier": "Tier 1",
        "title": "Heart bypass surgery",
        "url": "https://medlineplus.gov/ency/article/002946.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific cardiovascular specialty guideline",
        "key": "aha-revascularization",
        "organization": "American Heart Association, American College of Cardiology, and Society for Cardiovascular Angiography and Interventions",
        "publicationOrRevisionDate": "2021-12-09",
        "tier": "Tier 1",
        "title": "2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization",
        "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001038"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-pci",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Angioplasty and stent placement - heart",
        "url": "https://medlineplus.gov/ency/article/007473.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-cholecystectomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "2025-07-09",
        "tier": "Tier 1",
        "title": "Laparoscopic gallbladder removal",
        "url": "https://medlineplus.gov/ency/article/007371.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific surgical specialty safety guidance",
        "key": "sages-cholecystectomy",
        "organization": "Society of American Gastrointestinal and Endoscopic Surgeons",
        "publicationOrRevisionDate": "current program page; date not stated",
        "tier": "Tier 1",
        "title": "Safe Cholecystectomy Program",
        "url": "https://www.sages.org/safe-cholecystectomy-program/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-appendectomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "2026-01-01",
        "tier": "Tier 1",
        "title": "Appendectomy",
        "url": "https://medlineplus.gov/ency/article/002921.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific surgical specialty patient education",
        "key": "acs-appendectomy",
        "organization": "American College of Surgeons",
        "publicationOrRevisionDate": "current patient education page; date not stated",
        "tier": "Tier 1",
        "title": "Appendectomy",
        "url": "https://www.facs.org/for-patients/the-day-of-your-surgery/appendectomy/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-colectomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Large bowel resection",
        "url": "https://medlineplus.gov/ency/article/002941.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific colorectal specialty patient education",
        "key": "ascrs-ostomy",
        "organization": "American Society of Colon and Rectal Surgeons",
        "publicationOrRevisionDate": "current patient education page; date not stated",
        "tier": "Tier 1",
        "title": "Ostomy expanded information",
        "url": "https://fascrs.org/patients/diseases-and-conditions/a-z/ostomy-expanded-version"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-thyroidectomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Thyroid gland removal",
        "url": "https://medlineplus.gov/ency/article/002933.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific endocrine specialty education",
        "key": "ata-thyroid-surgery",
        "organization": "American Thyroid Association",
        "publicationOrRevisionDate": "current patient brochure; date stated by source",
        "tier": "Tier 1",
        "title": "Thyroid Surgery",
        "url": "https://www.thyroid.org/thyroid-surgery/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-hip-replacement",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Hip joint replacement",
        "url": "https://medlineplus.gov/ency/article/002975.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific orthopedic specialty education",
        "key": "aaos-hip-replacement",
        "organization": "American Academy of Orthopaedic Surgeons",
        "publicationOrRevisionDate": "current OrthoInfo review date shown by source",
        "tier": "Tier 1",
        "title": "Total Hip Replacement",
        "url": "https://orthoinfo.aaos.org/en/treatment/total-hip-replacement/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-knee-replacement",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Knee joint replacement",
        "url": "https://medlineplus.gov/ency/article/002974.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific orthopedic specialty education",
        "key": "aaos-knee-replacement",
        "organization": "American Academy of Orthopaedic Surgeons",
        "publicationOrRevisionDate": "current OrthoInfo review date shown by source",
        "tier": "Tier 1",
        "title": "Total Knee Replacement",
        "url": "https://orthoinfo.aaos.org/en/treatment/total-knee-replacement/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-craniotomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "2025-01-13",
        "tier": "Tier 1",
        "title": "Brain surgery",
        "url": "https://medlineplus.gov/ency/article/003018.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific neurosurgical specialty context",
        "key": "aans-craniotomy",
        "organization": "American Association of Neurological Surgeons",
        "publicationOrRevisionDate": "current specialty page; date not stated",
        "tier": "Tier 1",
        "title": "Brain Tumors",
        "url": "https://www.aans.org/patients/conditions-treatments/brain-tumors/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-laminectomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Laminectomy",
        "url": "https://medlineplus.gov/ency/article/007389.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific neurosurgical specialty context",
        "key": "aans-lumbar-stenosis",
        "organization": "American Association of Neurological Surgeons",
        "publicationOrRevisionDate": "current specialty page; date not stated",
        "tier": "Tier 1",
        "title": "Lumbar Spinal Stenosis",
        "url": "https://www.aans.org/patients/conditions-treatments/lumbar-spinal-stenosis/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-turp",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Transurethral resection of the prostate",
        "url": "https://medlineplus.gov/ency/article/002996.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific federal urologic guidance",
        "key": "niddk-bph-treatment",
        "organization": "National Institute of Diabetes and Digestive and Kidney Diseases",
        "publicationOrRevisionDate": "current NIH page; date shown by source",
        "tier": "Tier 1",
        "title": "Treatment for Benign Prostatic Hyperplasia",
        "url": "https://www.niddk.nih.gov/health-information/urologic-diseases/prostate-problems/enlarged-prostate-benign-prostatic-hyperplasia/treatment"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-hysterectomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Hysterectomy",
        "url": "https://medlineplus.gov/ency/article/002915.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific gynecologic specialty education",
        "key": "acog-hysterectomy",
        "organization": "American College of Obstetricians and Gynecologists",
        "publicationOrRevisionDate": "current FAQ review date shown by source",
        "tier": "Tier 1",
        "title": "Hysterectomy",
        "url": "https://www.acog.org/womens-health/faqs/hysterectomy"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-mastectomy",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Mastectomy",
        "url": "https://medlineplus.gov/ency/article/002919.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific federal oncology guidance",
        "key": "nci-breast-surgery",
        "organization": "National Cancer Institute",
        "publicationOrRevisionDate": "current NCI page; date shown by source",
        "tier": "Tier 1",
        "title": "Breast Cancer Treatment",
        "url": "https://www.cancer.gov/types/breast/breast-cancer-treatment"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-lung-surgery",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Lung surgery",
        "url": "https://medlineplus.gov/ency/article/002956.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific thoracic oncology education",
        "key": "acs-lung-surgery",
        "organization": "American Cancer Society",
        "publicationOrRevisionDate": "current clinical review date shown by source",
        "tier": "Tier 2",
        "title": "Surgery for Non-Small Cell Lung Cancer",
        "url": "https://www.cancer.org/cancer/types/lung-cancer/treating-non-small-cell/surgery.html"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "Tier 1 procedure-specific patient education",
        "key": "nlm-kidney-transplant",
        "organization": "National Library of Medicine, MedlinePlus",
        "publicationOrRevisionDate": "current page; exact review date shown by source",
        "tier": "Tier 1",
        "title": "Kidney transplant",
        "url": "https://medlineplus.gov/ency/article/003005.htm"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific federal transplant guidance",
        "key": "niddk-kidney-transplant",
        "organization": "National Institute of Diabetes and Digestive and Kidney Diseases",
        "publicationOrRevisionDate": "current NIH page; date shown by source",
        "tier": "Tier 1",
        "title": "Kidney Transplant",
        "url": "https://www.niddk.nih.gov/health-information/kidney-disease/kidney-failure/kidney-transplant"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific federal epilepsy education including SEEG",
        "key": "ninds-epilepsy-seeg",
        "organization": "National Institute of Neurological Disorders and Stroke",
        "publicationOrRevisionDate": "2025-05",
        "tier": "Tier 1",
        "title": "Epilepsy and Seizures",
        "url": "https://www.ninds.nih.gov/sites/default/files/2025-05/epilepsy-and-seizures.pdf"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific peer-reviewed SEEG safety and effectiveness review",
        "key": "pubmed-seeg-review",
        "organization": "PubMed-indexed peer-reviewed literature",
        "publicationOrRevisionDate": "2025-07",
        "tier": "Tier 3",
        "title": "Stereoelectroencephalography versus subdural electrodes for invasive monitoring of drug-resistant epilepsy patients: a systematic review and meta-analysis",
        "url": "https://pubmed.ncbi.nlm.nih.gov/40209398/"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific hepatology specialty guidance for temporary balloon tamponade",
        "key": "aasld-variceal-hemorrhage",
        "organization": "American Association for the Study of Liver Diseases",
        "publicationOrRevisionDate": "2017",
        "tier": "Tier 1",
        "title": "Portal Hypertensive Bleeding in Cirrhosis: Risk Stratification, Diagnosis, and Management",
        "url": "https://www.aasld.org/sites/default/files/2022-04/Garcia-Tsao_et_al-2017-Hepatology.pdf"
      },
      {
        "accessedAt": "2026-08-08",
        "evidenceRole": "procedure-specific clinical review of device purpose, monitoring, and complications",
        "key": "ncbi-sengstaken-blakemore",
        "organization": "National Center for Biotechnology Information, StatPearls",
        "publicationOrRevisionDate": "2026",
        "tier": "Tier 2",
        "title": "Sengstaken-Blakemore Tube",
        "url": "https://www.ncbi.nlm.nih.gov/books/NBK558924/"
      }
    ]
  };
  Object.freeze(entries);
  Object.freeze(database.status);
  Object.freeze(database.crossLinkRecords);
  Object.freeze(database.sourceReferences);
  return Object.freeze(database);
});
