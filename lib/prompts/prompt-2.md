Based on the article content, create 3-4 MCQs that would be appropriate at the end of the article to assess comprehension. Include the MCQs in the MDX file, formatted as specified.


**MCQs:**

   - At the end of the article, include an `<MCQGroup>` component.
   - Provide 3-4 challenging USMLE-style MCQs.
   - Detailed explanation as feedback if correct, and helpful hints guiding towards the answer without giving way the answer as feedback if incorrect
   - Each question should be an object with the following properties like the example below:

     ```mdx
     <MCQGroup questions={[
       {
         question: "A 67-year-old woman with a history of hypertension and type 2 diabetes presents to the emergency department with crushing chest pain. ECG shows ST-segment elevation in V1-V4. She undergoes successful primary PCI with a drug-eluting stent to the proximal LAD. Two days later, she is found to have paroxysmal atrial fibrillation with a CHA₂DS₂-VASc score of 4. Her other medications include metformin, lisinopril, and atorvastatin. Which of the following antithrombotic regimens would be most appropriate at discharge?",
         options: [
           "Aspirin 81mg daily + warfarin (target INR 2-3)",
           "Aspirin 81mg daily + clopidogrel 75mg daily",
           "Aspirin 81mg daily + clopidogrel 75mg daily + warfarin (target INR 2-3) for 6 months, then warfarin alone",
           "Aspirin 81mg daily + clopidogrel 75mg daily + rivaroxaban 15mg daily",
           "Apixaban 5mg twice daily + clopidogrel 75mg daily"
         ],
         correctAnswer: 2,
         correctFeedback: "Correct! This patient requires both dual antiplatelet therapy (DAPT) for the recent PCI with drug-eluting stent AND anticoagulation for new-onset atrial fibrillation with a high CHA₂DS₂-VASc score. Triple therapy with DAPT plus anticoagulation is recommended initially, but should be kept as short as possible (typically 6 months for drug-eluting stents) to balance the risk of stent thrombosis against bleeding risk. After 6 months, the patient can be transitioned to warfarin monotherapy with a target INR of 2-3. The other options either omit necessary components of therapy or maintain triple therapy for too long, increasing bleeding risk unnecessarily.",
         incorrectFeedback: "Consider the multiple competing issues in this case: 1) The need for DAPT after drug-eluting stent placement, 2) The new requirement for anticoagulation due to AF with a high CHA₂DS₂-VASc score, and 3) The need to balance antithrombotic efficacy with bleeding risk. What is the current guideline-recommended approach for managing these competing needs?"
       },
       // Add more questions here
     ]} />
     ```
