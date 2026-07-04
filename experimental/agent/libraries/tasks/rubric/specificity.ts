import type { Rubric } from "../types.ts";

export const specificity: Rubric = {
  description:
    "How fully specified a statement is. A high score suggests the statement cannot be expounded on further relative to the statement's apparent purpose.",
  examples: {
    1: [
      "Marx was cool.",
      "Do the thing!",
      "I've been thinking a lot about the whole situation, and there's a lot to unpack there, but at the end of the day it kind of is what it is, you know? Things have been moving in a certain direction, and I feel like generally speaking that's probably a good thing, or at least it's not a bad thing, but.. there are definitely some factors to consider, and some of them matter more than others. Anyway, I think if we just stay the course, it should all work itself out eventually!",
    ],
    3: [
      "Plato released the Republic later.",
      "Please make me some tea.",
    ],
    5: [
      "Meeting: 3:00 PM EST, July 8, Room 204.",
      "Time of death: 3:47AM. The likely mortal wound consists of a contusion spreading from the victim's right ear, across their temple and nose. This blunt force trauma also shattered their septum. The wound is too 'curved' to be a rigid object - we suspect the murder weapon to be an industrial metal chain of some kind.",
      "Let's cook a hamburger. I'd like a half-pound patty, grass fed, cooked medium-well. The bun should be whole grain. Let's add a couple leaves of lettuce, a generous slice of steak tomato, and some mayo, ketchup, and not-too-much mustard.",
    ],
  },
};
