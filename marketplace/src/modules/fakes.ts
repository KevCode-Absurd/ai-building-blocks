// Stand-in model replies for MODEL_MODE=fake (local demo and staging before keys are set).
// Each module registers its own fakes in <module>/fakes.ts; this file only imports them.
// Fakes are registered at import but only used when MODEL_MODE is "fake".
import "./intake/fakes.ts";
import "./runner/fakes.ts";
import "./evaluation/fakes.ts";
import "./studio/fakes.ts";
