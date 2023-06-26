import FirstTemplate, { Props } from './templates/FirstTemplate';
import { ConstTemplateObj } from './types';

export const TEMPLATES: ConstTemplateObj[] = [
  {
    id: 'formalTemplate',
    name: 'Formal Template',
    component: FirstTemplate as React.FC<Props>,
  },
];
