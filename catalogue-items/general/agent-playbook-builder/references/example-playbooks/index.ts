/**
 * Three Example Playbooks — Registry
 *
 * Import this registry from your playbook engine:
 *
 *   import { PLAYBOOKS } from './three-example-playbooks'
 *
 * Add your own playbook by creating a new file in this folder and appending
 * it here.
 */

import { scalingWinnerPlaybook } from './scaling-winner'
import { killingFatiguedCreativePlaybook } from './killing-fatigued-creative'
import { newAccountOnboardingPlaybook } from './new-account-onboarding'

export const PLAYBOOKS = [
  scalingWinnerPlaybook,
  killingFatiguedCreativePlaybook,
  newAccountOnboardingPlaybook,
]

export {
  scalingWinnerPlaybook,
  killingFatiguedCreativePlaybook,
  newAccountOnboardingPlaybook,
}
