import FirstTemplate from './templates/FirstTemplate';
import { TemplateComponent } from './templates/types';

export type CVTemplate = {
  id: string;
  name: string;
  component: TemplateComponent;
};

export const TEMPLATES: CVTemplate[] = [
  {
    id: 'formalTemplate',
    name: 'Formal Template',
    component: FirstTemplate,
  },
];
