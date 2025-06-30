// generator.mjs
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import handlebars from 'handlebars';
import pluralize from 'pluralize';
import { startCase } from 'lodash-es';
import inquirer from 'inquirer';

const ORIGIN_PATH = path.join(cwd(), 'scripts/generators/resources');
const DEST_PATH = (mod) => path.join(cwd(), 'src/app', mod);

const FOLDERS = [
  'controllers/http',
  'controllers/messaging',
  'dtos',
  'entities',
  'repositories',
  'services',
  'types',
];

const slugify = (string) =>
  string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');

const typeMap = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  DateTime: 'Date',
};

const generateDtoFieldsFromModel = (modelName) => {
  const schemaPath = path.join(cwd(), 'prisma/schema.prisma');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  const modelRegex = new RegExp(`model\\s+${modelName}\\s+{([\\s\\S]*?)}`, 'm');
  const match = modelRegex.exec(schema);
  if (!match) return '';

  const body = match[1];
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter((line) => line && line.includes('// @api'));

  const fields = lines.map((line) => {
    const cleanLine = line.split('//')[0].trim(); // remove comment
    const [name, rawType, ...rest] = cleanLine.split(/\s+/);
    const isOptional = rawType.endsWith('?') || rest.some((r) => r.includes('?'));
    const cleanType = rawType.replace('?', '');
    const tsType = typeMap[cleanType] || 'any';
    const optionalMark = isOptional ? '?' : '';
    const apiPropertyOpts = isOptional ? '{ required: false }' : '';

    return `@ApiProperty(${apiPropertyOpts})\n${name}${optionalMark}: ${tsType};`;
  });

  return fields.join('\n\n');
};

const compile = (content, context) => handlebars.compile(content)(context);

const getPrismaModels = () => {
  const schemaPath = path.join(cwd(), 'prisma/schema.prisma');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const modelRegex = /^model\s+(\w+)\s+{/gm;

  const models = [];
  let match;
  while ((match = modelRegex.exec(schema)) !== null) {
    models.push(match[1]);
  }
  return models;
};

const prepareDirectories = (baseDir) => {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  FOLDERS.forEach((folder) => {
    const folderPath = path.join(baseDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
};

const loadTemplate = (templatePath) =>
  fs.readFileSync(path.join(ORIGIN_PATH, templatePath), 'utf8');

const buildFileStructure = (dest, fileName) => [
  { path: 'index.ts', template: 'index.hbs' },
  { path: `${fileName}.module.ts`, template: 'module.hbs' },
  { path: 'controllers/index.ts', template: 'controllers/index.hbs' },
  {
    path: `controllers/http/${fileName}.controller.ts`,
    template: 'controllers/http/controller.hbs',
  },
  {
    path: `controllers/http/${fileName}.controller.spec.ts`,
    template: 'controllers/http/test.hbs',
  },
  {
    path: `controllers/messaging/${fileName}.controller.ts`,
    template: 'controllers/messaging/controller.hbs',
  },
  { path: 'services/index.ts', template: 'services/index.hbs' },
  {
    path: `services/${fileName}.service.ts`,
    template: 'services/service.hbs',
  },
  { path: 'dtos/index.ts', template: 'dtos/index.hbs' },
  {
    path: `dtos/create-${fileName}.dto.ts`,
    template: 'dtos/create.hbs',
  },
  {
    path: `dtos/update-${fileName}.dto.ts`,
    template: 'dtos/update.hbs',
  },
  { path: 'repositories/index.ts', template: 'repositories/index.hbs' },
  {
    path: `repositories/${fileName}.repository.ts`,
    template: 'repositories/repository.hbs',
  },
].map(({ path: relativePath, template }) => ({
  path: path.join(dest, relativePath),
  content: loadTemplate(template),
}));

const promptAnswers = async (models) =>
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: "What's your feature name?",
    },
    {
      type: 'list',
      name: 'model',
      message: 'Select the model from schema.prisma:',
      choices: models,
    },
  ]);

handlebars.registerHelper('splitLines', function (text) {
  return text.split('\n');
});

const main = async () => {
  const models = getPrismaModels();

  if (models.length === 0) {
    console.error('❌ No models found in schema.prisma');
    return;
  }

  const { name, model } = await promptAnswers(models);

  const pluralName = pluralize(name);
  const className = startCase(pluralName).replace(/ /g, '');
  const variableName = model.toLowerCase();
  const fileName = slugify(pluralName);
  const dest = DEST_PATH(fileName);

  prepareDirectories(dest);

  const dtoFields = generateDtoFieldsFromModel(model);

  const files = buildFileStructure(dest, fileName);
  files.forEach(({ path: filePath, content }) => {
    const compiled = compile(content, {
      className,
      variableName,
      fileName,
      modelName: model,
      dtoFields,
    });
    fs.writeFileSync(filePath, compiled);
  });

  console.log(`✅ Feature for ${model} generated at ${dest}`);
};

main();
