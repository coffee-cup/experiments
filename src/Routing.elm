module Routing exposing (..)

import Navigation exposing (Location)
import Route exposing (..)


type Sitemap
    = HomeRoute
    | ExperimentRoute String
    | NotFoundRoute


homeR : Route.Route Sitemap
homeR =
    HomeRoute := static ""


experimentR : Route.Route Sitemap
experimentR =
    ExperimentRoute := string


sitemap : Route.Router Sitemap
sitemap =
    router [ homeR, experimentR ]


removeTrailingSlash : String -> String
removeTrailingSlash s =
    if (String.endsWith "/" s) && (String.length s > 1) then
        String.dropRight 1 s
    else
        s


match : String -> Sitemap
match s =
    s
        |> removeTrailingSlash
        |> Route.match sitemap
        |> Maybe.withDefault NotFoundRoute


toString : Sitemap -> String
toString r =
    case r of
        HomeRoute ->
            reverse homeR []

        ExperimentRoute e ->
            reverse experimentR [ e ]

        NotFoundRoute ->
            "/404"


mainTitle : String
mainTitle =
    "e."


pageTitle : Sitemap -> String
pageTitle r =
    case r of
        HomeRoute ->
            mainTitle

        ExperimentRoute e ->
            mainTitle ++ " - " ++ e

        NotFoundRoute ->
            "Not Found"


parseLocation : Location -> Sitemap
parseLocation location =
    match location.pathname


navigateTo : Sitemap -> Cmd msg
navigateTo =
    toString >> Navigation.newUrl
