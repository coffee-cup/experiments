port module Update exposing (..)

import Messages exposing (Msg(..))
import Models exposing (Model)
import Routing exposing (parseLocation, navigateTo, Sitemap(..))


port scrollToTop : Bool -> Cmd msg


port pageView : String -> Cmd msg


port changeMetadata : String -> Cmd msg


port resetBackground : String -> Cmd msg


changePage : Sitemap -> Cmd msg
changePage page =
    Cmd.batch
        [ navigateTo page
        , scrollToTop True
        ]


locationChanged : Sitemap -> Cmd msg
locationChanged page =
    let
        pageString =
            Routing.toString page
    in
        Cmd.batch
            [ changeMetadata (Routing.pageTitle page)
            , pageView pageString
            , resetBackground pageString
            ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnLocationChange location ->
            let
                newRoute =
                    parseLocation location
            in
                ( { model | route = newRoute }, locationChanged newRoute )

        ShowHome ->
            ( model, changePage HomeRoute )

        ShowExperiment e ->
            ( model, changePage (ExperimentRoute e) )
