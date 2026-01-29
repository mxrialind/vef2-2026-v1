import fs from "node:fs/promises";
import { parseLine } from "./lib/parse.js";
import {
  generateIndexHtml,
  generateQuestionCategoryHtml,
  generateQuestionHtml,
} from "./lib/html.js";

const MAX_QUESIONS_PER_CATEGORY = 100;

async function main() {
  //Búa til dist möppu ef ekki til
  const distPath = "./dist";
  await fs.mkdir(distPath, { recursive: true });

  const content = await fs.readFile("./questions.csv", "utf-8");

  const lines = content.split("\n");

  const questions = lines.map(parseLine).filter(Boolean);
  
    //smá hjálp frá chatgpt fyrir ítrun
    const categoryMap = {
      "1": { file: "almenn", title: "Almenn kunnátta"},
      "2": { file: "nattura", title: "Náttúra og vísindi"},
      "3": { file: "bokmenntir", title: "Bókmenntir og listir"},
      "4": { file: "saga", title: "Saga"},
      "5": { file: "landafraedi", title: "Landafræði"},
      "6": { file: "skemmtun", title: "Skemmtun og afþreying"},
      "7": { file: "ithrottir", title: "Íþróttir"}
    };

  for (const [catNum, cat] of Object.entries(categoryMap)) {
    
    const categoryQuestions = questions.filter((q) => q.categoryNumber === catNum && q.quality === "3").slice(0, MAX_QUESIONS_PER_CATEGORY);
      
    const questionsHtml = categoryQuestions
      .map(generateQuestionHtml)
      .join("\n");
      
    const output = generateQuestionCategoryHtml(cat.title, questionsHtml);
      
    const path = `./dist/${cat.file}.html`;
      
    await fs.writeFile(path, output, "utf-8");
    console.log(`Generated ${path}`);
  }  

  const indexHtml = generateIndexHtml();

  await fs.writeFile('./dist/index.html', indexHtml, "utf-8");
}

main().catch((error) => {
  console.error("error generating", error);
});
