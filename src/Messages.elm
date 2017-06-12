module Messages exposing (..)

import Navigation exposing (Location)


type Msg
    = OnLocationChange Location
    | ShowHome
    | ShowExperiment String
