import { CVInfoObj } from '../types';

export type TemplateComponentProps = {
  cvValues: Partial<CVInfoObj>;
};
export type TemplateComponent = (arg: TemplateComponentProps) => JSX.Element;
