import { OnboardingStepAlias } from '@/enums/onboarding-step-alias';

export interface OnboardingStep {
  alias: OnboardingStepAlias;
  label: string;
  Component: React.FC;
}
