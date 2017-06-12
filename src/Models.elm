module Models exposing (..)

import Routing exposing (Sitemap)


type alias ExperimentInfo =
    { script : String
    , name : String
    , desc : String
    }


type alias Model =
    { route : Sitemap
    }


initialModel : Sitemap -> Model
initialModel sitemap =
    { route = sitemap
    }
