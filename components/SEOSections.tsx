import React from "react";
import { SEOMetaDataSection } from "./SEOMetaDataSection";
import {
  validateDescription,
  validateTitle,
  validateUrl,
} from "../utils/validators";

type BaseSectionProps = {
  readonly value: string;
};

export const SEOTitleSection: React.FC<BaseSectionProps> = ({ value }) => (
  <SEOMetaDataSection
    title="Meta title:"
    value={value}
    errors={Array.from(validateTitle(value))}
  />
);

export const SEODescriptionSection: React.FC<BaseSectionProps> = ({ value }) => (
  <SEOMetaDataSection
    title="Meta description:"
    value={value}
    errors={Array.from(validateDescription(value))}
  />
);

export const SEOUrlSection: React.FC<BaseSectionProps> = ({ value }) => (
  <SEOMetaDataSection
    title="Friendly url:"
    value={value}
    errors={Array.from(validateUrl(value))}
  />
);
