module Info exposing (..)

import Models exposing (ExperimentInfo)


infos : List ExperimentInfo
infos =
    [ feigenInfo, genInfo, fireworksInfo, flowFieldInfo, chaosInfo, walkInfo, particlesInfo, agentsInfo, flockingInfo ]


findMatch : String -> Maybe ExperimentInfo
findMatch script =
    infos
        |> List.filter (\i -> i.script == script)
        |> List.head


feigenInfo : ExperimentInfo
feigenInfo =
    ExperimentInfo "feigen" "Feigenbaum Constant" """
4.669201609..., the [Feigenbaum constant](http://mathworld.wolfram.com/FeigenbaumConstant.html) is a universal constant
that describes functions approaching chaos via period doubling.

This function appears to jump between
1, 2, 4, ..., values until it suddenly becomes chaotic. This visualization shows random windows of the output.
[Check out this video](https://www.youtube.com/watch?v=ETrYE4MdoLQ) for an explanation of the beauty.
    """


genInfo : ExperimentInfo
genInfo =
    ExperimentInfo "gen" "Genetic Evolution" """
These circles will eventually evolve to reach the target in the shortest amount of time. After each generation
the circles mate and produce offspring. The circles with the highest fitness _(made it closest to the target in
shortest amount of time)_ have a better probability of being a parent. There is a 1% chance a childs gene will mutate
into a random value.

**Place walls by clicking**
"""


chaosInfo : ExperimentInfo
chaosInfo =
    ExperimentInfo "chaos" "Chaos Game" """
Pick a random point inside a regular n sided polygon. Pick another point halfway between the first point
and a random vertex of the polygon. Repeat this process from the new point. This is exactly what this
visualization is doing, only 1000's of times. It is called a [chaos game](http://mathworld.wolfram.com/ChaosGame.html),
and shows how fractal like beauty can come from randomness.
    """


walkInfo : ExperimentInfo
walkInfo =
    ExperimentInfo "walk" "Walk" "Just a point out for a [Perlin noise](https://flafla2.github.io/2014/08/09/perlinnoise.html) walk."


flowFieldInfo : ExperimentInfo
flowFieldInfo =
    ExperimentInfo "flowfield" "Flow Field" """
This is a Perlin noise [flow field](https://en.wikipedia.org/wiki/Vector_field).
The particles move pseudorandomly and paint the canvas in an _awesome_ way.
"""


particlesInfo : ExperimentInfo
particlesInfo =
    ExperimentInfo "particles" "Particles" """
This represents my dive into particle systems. The particles are weakly attracted to and strongly repulsed from the center.

**Click to add a system**.
"""


agentsInfo : ExperimentInfo
agentsInfo =
    ExperimentInfo "agents" "Autonomous Agents" """
Here I am experimenting with autonomous agents from the [Nature of Code](http://natureofcode.com/book/chapter-6-autonomous-agents/) book.
These _agents_ all have specific behaviours they follow, which include wandering, path following, perlin noise flow field, and seeking.
"""


fireworksInfo : ExperimentInfo
fireworksInfo =
    ExperimentInfo "fireworks" "Fireworks" "boom boom. _Click to play sound._"


flockingInfo : ExperimentInfo
flockingInfo =
    ExperimentInfo "flocking" "Flocks" ""
