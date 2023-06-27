import { CVInfoObj } from '../types';

export type TemplateComponentProps = {
  cvValues: CVInfoObj;
};
export type TemplateComponent = (arg: TemplateComponentProps) => JSX.Element;
