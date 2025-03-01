**Objective:**

Using the provided unstructured article content, create a comprehensive medical article in MDX format suitable for a Nextra documentation website. The article should:

- **Complete Information Retention:** Include all information from the original text without omissions but ensure that the content is concise and readable.
- **Paraphrasing for Clarity:** Rephrase the content to improve clarity and readability while preserving the original meaning.
- **Enhanced Readability:** Organize and format the content to enhance readability and information retention.

---

**Instructions:**

1. **Necessary Imports:**

   - At the very beginning of the MDX file, include the following import statements:

     ```mdx
     import MCQGroup from '@/components/MCQGroup'
     import { Callout } from 'nextra/components'

    // .. rest of the article below

     ```

2. **Article Title:**

   - Assign a short and appropriate title to the article as per the topic for example "Pulmonary Embolism".
   - Use `#` for the main title (top-level heading).

3. **Content Structure and Formatting:**

   - **Organization:**
     - Organize the content into logical sections and subsections using appropriate headings (`##`, `###`, etc.).
     - Ensure a coherent flow that guides the reader through the topic effectively.
   - **Paraphrasing:**
     - Rephrase the original text to improve clarity and readability without altering the intended meaning.
     - Ensure the content is concise and readable.
     - Avoid plagiarism by using your own words while conveying the same information.
   - **Completeness:**
     - Include all information from the original unstructured text.
     - Do not omit any details, data, or nuances present in the source material.
   - **Formatting:**
     - Use bullet points and numbered lists to break down information as much as possible.
     - **Bold** key terms or important concepts to emphasize them, except for numericals and special characters, there you must use backticks.
     - *Italicize* notes, exceptions, or terms that need emphasis.
     - Use inline code formatting (backticks) to escape special characters like `<` or `>` while also highlighting specific terms (e.g., `SpO2 <94%`, `<12 hours`, `>55 years`, `MCV > 100fL`. This is incorrect **<12 hours** as it does not escape the special character).
     - Present data using Markdown tables where appropriate for better organization.
   - **MDX Features:**
     - Include callouts to highlight important notes, warnings, or tips. For example:

       ```mdx
       <Callout emoji="⚠️">
       **Warning:** Always monitor vital signs continuously during the procedure.
       </Callout>
       ```

     - Use foldable sections (`<details>` and `<summary>` tags) for additional information that readers can choose to expand. For example:

       ```mdx
       <details>
       <summary>Detailed Pathophysiology</summary>

       [Paraphrased detailed information here.]

       </details>
       ```

4. **Handling Images and Diagrams:**

   - If the content references images or diagrams, include them using appropriate Markdown syntax or provide placeholders if images are not available. For example:

     ```mdx
     ![Description of Image](path/to/image.png)
     ```

5. **Abbreviations and Acronyms:**

   - Define all abbreviations and acronyms upon their first occurrence in the text. For example, "Electrocardiogram (ECG)."

6. **References:**

   - Include a **References** section at the end of the article ensuring it is formatted as Markdown links.

7. **General Guidelines:**

   - **Language and Tone:**
     - Write in clear, professional language suitable for a medical audience.
     - Maintain an objective tone appropriate for medical documentation.
   - **Accuracy:**
     - Ensure all medical information is accurate, up-to-date, and evidence-based.
   - **Quality Assurance:**
     - Ensure your response contains only the final MDX file without syntax errors, typos, and formatting issues ready for publication.
     - Verify that all MDX and Markdown syntax renders correctly.
   - **Consistency:**
     - Maintain consistent formatting and style throughout the document.

---

**Additional Notes:**

- **No Information Loss:** Every piece of information from the original text must be included in the article.
- **Enhanced Readability:** Structure the content to make it easily digestible, using formatting tools to highlight key points and facilitate learning.
- **Paraphrasing Techniques:**
  - Use synonyms and restructured sentences to convey the same information differently.
  - Break down complex sentences into simpler ones where appropriate.
  - Use active voice for clearer statements.

---

**Example of Paraphrasing and Formatting:**

*Original Text:*

"Patients with SpO2 less than 94% should be administered oxygen therapy immediately to prevent hypoxia."

*Paraphrased and Formatted:*

- **Oxygen Therapy**
  - Initiate oxygen administration for patients with `SpO2 <94%` to prevent hypoxia.
