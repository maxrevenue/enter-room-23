module Room23.Main

open Elmish
open Elmish.React
open Room23

Program.mkProgram State.init State.update App.view
|> Program.withSubscription State.subscribe
|> Program.withReactSynchronous "root"
|> Program.run