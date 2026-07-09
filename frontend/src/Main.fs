module MidnightLounge.Main

open Elmish
open Elmish.React
open MidnightLounge

// ---------------------------------------------------------------------------
// Application entry point — wires the Elmish MVU loop into React.
// ---------------------------------------------------------------------------

Program.mkProgram State.init State.update App.view
|> Program.withSubscription State.subscribe
|> Program.withReactSynchronous "root"
|> Program.run
