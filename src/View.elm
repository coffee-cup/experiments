module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Markdown
import Messages exposing (Msg(..))
import Models exposing (Model, ExperimentInfo)
import Info exposing (findMatch, infos)
import Routing exposing (Sitemap(..))
import ViewUtils exposing (..)


view : Model -> Html Msg
view model =
    div [ class "ph6-ns ph4-m ph3" ]
        [ div [ class "full" ] [ page model ]
        , footer
        ]



-- Router


page : Model -> Html Msg
page model =
    case model.route of
        HomeRoute ->
            homeView model

        ExperimentRoute e ->
            experimentPage e

        NotFoundRoute ->
            notFoundView


footer : Html Msg
footer =
    div [ class "footer pb4" ]
        [ p [ class "f5" ]
            [ a [ onClick ShowHome, class "dim none pointer" ] [ text "♥" ]
            ]
        ]



-- Routes


homeView : Model -> Html Msg
homeView model =
    div []
        [ headingLarge "e."
        , p [ class "measure" ]
            [ text """
A collection of fun little experiments I've made
 while procrastinating studying for class.
"""
            ]
        , p [ class "measure" ]
            [ text "They are all made with "
            , a [ href "http://p5js.org/" ] [ text "p5.js" ]
            , text """
 and explore some topics I find really interesting, such as random processes,
 mathematical visualizations, and evolving systems. I recommend viewing these on a Desktop
 browser, although they will work fine on mobile.
"""
            , text "The code can be found "
            , a [ href "https://github.com/coffee-cup/experiments" ] [ text "on Github" ]
            , text "."
            ]
        , experimentList
        , p [ class "measure i" ]
            [ text " As these are just \"experiments\", their performance may not be optimized and might run slower on old computers."
            ]
        ]


notFoundView : Html Msg
notFoundView =
    div [ class "not-found full vertical-center" ]
        [ div []
            [ h2 [ class "f2 mv4 mono" ] [ text "¯\\_(ツ)_/¯" ]
            , p [ class "measure" ]
                [ text "Page not found. "
                , a [ onClick ShowHome, class "pointer su-colour" ] [ text "Go home" ]
                , text "."
                ]
            ]
        ]


htmlString : String -> String
htmlString script =
    """
    <!doctype html>
    <html>
        <head>
            <script src=""" ++ script ++ """></script>
        </head>
        <body style="margin: 0px;">
        </body>
    </html>
    """


noneInfo : ExperimentInfo
noneInfo =
    ExperimentInfo "" "" ""


frame : String -> Html msg
frame e =
    let
        script =
            "/" ++ e ++ ".js"
    in
        iframe [ id "e-iframe", class ("f-" ++ e), srcdoc (htmlString script) ] []


experimentInfo : Maybe ExperimentInfo -> Html Msg
experimentInfo maybeInfo =
    case maybeInfo of
        Nothing ->
            div [ class "info" ]
                [ headingSmall "e."
                ]

        Just info ->
            div [ class "info" ]
                [ div [ class "mv4" ]
                    [ a [ onClick ShowHome, class "none" ] [ i [ class "pr2 f2 icon-back o-40" ] [] ]
                    , span [ class "h2 f2" ] [ text info.name ]
                    ]
                , p [ class "measure" ] [ Markdown.toHtml [] info.desc ]
                ]


experimentPage : String -> Html Msg
experimentPage e =
    let
        maybeInfo =
            findMatch e

        info =
            Maybe.withDefault noneInfo maybeInfo

        script =
            info.script
    in
        div [ class ("art pt2 i-" ++ script) ]
            [ experimentInfo maybeInfo
            , div [] [ frame e ]
            ]


experimentLink : ExperimentInfo -> Html Msg
experimentLink e =
    li []
        [ a [ onClick (ShowExperiment e.script) ]
            [ text e.name ]
        ]


experimentList : Html Msg
experimentList =
    p []
        [ ul []
            (List.map experimentLink infos)
        ]


experimentsDetail : Html Msg
experimentsDetail =
    div []
        [ headingLarge "e."
        , p [ class "measure" ]
            [ text """
A collection of fun little experiments I've made
 while procrastinating studying for class.
"""
            ]
        , p [ class "measure" ]
            [ text "They are all made with "
            , a [ href "http://p5js.org/" ] [ text "p5.js" ]
            , text """
 and explore some topics I find really interesting, such as random processes,
 mathematical visualizations, and evolving systems. I recommend viewing these on a Desktop
 browser, although they will work fine on mobile.
"""
            , text "The code can be found "
            , a [ href "https://github.com/coffee-cup/experiments" ] [ text "on Github" ]
            , text "."
            ]
        , experimentList
        , p [ class "measure i" ]
            [ text " As these are just \"experiments\", their performance may not be optimized and might run slower on old computers."
            ]
        ]
