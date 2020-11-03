import { OnboardingStepAlias } from '@/enums/onboarding-step-alias';

export interface IOnboardingStep {
  alias: OnboardingStepAlias;
  label: string;
  Component: React.FC;
}
