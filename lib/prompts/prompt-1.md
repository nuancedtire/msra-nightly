**Objective:**

Using the provided article content, create a comprehensive medical article in MDX format suitable for a Nextra documentation website. The article should:

- Be formatted correctly with proper use of headings, bold text, italics, bullet points, numbered lists, tables, callouts, and foldable sections.
- Escape special characters using backticks (e.g., `<12 hours`).
- Include MDX features such as callouts and foldable sections to enhance readability.
- Follow MDX syntax best practices throughout.

---

**Instructions:**

1. **Start with Necessary Imports:**

   - At the beginning of the MDX file, include the import statements:

     ```mdx
     import MCQGroup from '@/components/MCQGroup'
     import { Callout } from 'nextra/components'
     ```

2. **Article Title:**

   - Use an appropriate and relevant title for the article.
   - Use `#` for the main title..

3. **Content Structure and Formatting:**

   - Organize content into logical sections using headings (`##`, `###`, etc.).
   - We do not need to include any overview or conclusion sections.
   - Keep information succinct and to the point without losing any important details.
   - Use bullet points and numbered lists for clarity.
   - Bold key terms or important concepts.
   - Italicize notes or exceptions.
   - Use inline code formatting (backticks) to escape special characters (e.g., `SpO2 <94%`, `<12 hours`).
   - Present data using Markdown tables where appropriate.
   - Use callouts to highlight important notes or warnings. For example:

     ```mdx
     <Callout emoji="💡">
     **Note:** Troponin levels can remain elevated for up to 10 days after myocardial injury.
     </Callout>
     ```

   - Use foldable sections for additional or extended information. Use the `summary` tag to provide a concise title for the foldable section. For example:

     ```mdx
     <details>
     <summary>Common Signs and Symptoms</summary>

     - **Chest Pain**
       - Crushing or pressure-like
       - May radiate to left arm, jaw, or back
       - Often accompanied by sweating

     - **Respiratory**
       - Shortness of breath
       - Rapid breathing
       - Orthopnea

     - **Other Symptoms**
       - Nausea and vomiting
       - Fatigue
       - Light-headedness
       - Anxiety

     </details>
     ```

5. **References:**

   - Include a **References** section at the end in Markdown format, citing relevant sources.