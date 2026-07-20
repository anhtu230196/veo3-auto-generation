// Cảnh 0–65. [content, characterNames, settingNames, propNames, era?]
export const part1 = [
  // 0
  ["Wide shot of an early-1900s New York street corner at dawn, a newsstand piled with fresh newspapers, several pedestrians in long coats and hats stopping in stunned surprise as they read. Cool grey-blue morning light.", [], [], ["The Newspaper"]],
  // 1
  ["Close-up of The Newspaper held open, its bold front-page masthead and grainy illustration filling the frame, a gloved hand gripping the edge. Dramatic cool tone.", [], [], ["The Newspaper"]],
  // 2
  ["Medium shot of an antique desktop globe in a study turned to show the empty white cap of the North Pole at the very top, warm lamplight beside it.", [], [], []],
  // 3
  ["Medium portrait shot of Frederick standing confidently in his fur anorak with a slight proud smile, warm golden celebratory light, against a plain softly blurred warm-toned background with no distinct objects, furniture, or setting visible — no ship, no rigging, no nautical elements of any kind. Frederick looks steadily ahead.", ["Frederick"], [], []],
  // 4
  ["Medium shot inside The Newsroom of the great printing press abruptly halted mid-run, a single sheet frozen half-printed, tense cool lighting.", [], ["The Newsroom"], []],
  // 5
  ["Medium shot in The Newsroom of a fresh newspaper slapped down hard onto a wooden desk, papers scattering, sharp cool blue-grey tension.", [], ["The Newsroom"], ["The Newspaper"]],
  // 6
  ["Medium portrait shot of Robert standing stern and defiant in his fur parka, his large mustache set and arms crossed, against a plain softly blurred cold-toned background with no distinct objects, furniture, or setting visible — no ship, no rigging, no nautical elements of any kind. Cold steel-blue tone.", ["Robert"], [], []],
  // 7
  ["Wide shot of the Pack Ice Field, two lone fur-clad explorer figures standing far apart on the endless ice, each facing the distant Pole, tension between them. Cold pale light.", [], ["Pack Ice Field"], []],
  // 8
  ["Wide shot of an early-1900s city crowd gathered on a street, many people in coats and hats reading newspapers with excited gestures, warm-neutral daylight.", [], [], ["The Newspaper"]],
  // 9
  ["Medium shot of a dim study desk piled with yellowing documents and stacked newspapers gathering dust, a single lamp, moody cool tone suggesting years passing.", [], [], []],
  // 10
  ["Close-up of a large early-1900s illustrated world map spread on a table, most regions filled in, warm amber lamplight across it.", [], [], []],
  // 11
  ["Close-up of the top of a world map where the Arctic remains an empty white blank, a finger resting near its edge, warm lamplight.", [], [], []],
  // 12
  ["Extreme wide shot of the Pack Ice Field stretching to a flat empty horizon under a pale sky, utterly featureless white, a lonely cold atmosphere.", [], ["Pack Ice Field"], []],
  // 13
  ["Wide shot of the Pack Ice Field with a large dark lead of open water splitting the ice, faint mist rising, an eerie dreamlike cool-blue tone.", [], ["Pack Ice Field"], []],
  // 14
  ["Wide shot of a lone wooden sail-and-steam ship threading through a channel in the pack ice, tall masts and a smokestack, cold pale daylight.", [], ["Pack Ice Field"], []],
  // 15
  ["Medium shot of gold coins and a ledger book on a dark table being pushed aside by a gloved hand, dim moody cool lighting.", [], [], []],
  // 16
  ["Wide shot of a single bare flagpole standing on a small rise of ice at the top of an empty white field, the ultimate prize, dramatic cold light.", [], ["Pack Ice Field"], []],
  // 17
  ["Close-up of a single boot print pressed into fresh white snow, the empty ice stretching beyond, crisp cool light.", [], [], []],
  // 18
  ["Wide shot of several old wooden sailing ships of different eras pushing into a frozen sea among ice floes, tall masts, a sense of many failed attempts. Cold grey tone.", [], ["Pack Ice Field"], []],
  // 19
  ["Wide shot of two grand 1840s British Royal Navy sailing warships setting out to sea under full canvas, flags flying, a proud imperial departure. Cool bright daytime.", [], [], []],
  // 20
  ["Wide shot of the deck of an 1840s warship crowded with rows of uniformed sailors standing at attention, disciplined and proud, cool daytime.", [], [], []],
  // 21
  ["Medium shot of sailors loading wooden crates and barrels of provisions into a ship's hold through a hatch, stacks of supplies, warm dockside light.", [], [], []],
  // 22
  ["Extreme wide shot of an empty frozen sea under a bleak grey sky, no ship in sight, an ominous silence. Cold desaturated tone.", [], ["Pack Ice Field"], []],
  // 23
  ["Wide shot from a distance of dark huddled human silhouettes around a bleak ice camp in swirling snow at dusk, rendered as flat black silhouette shapes with no anatomical or gore detail, deep desaturated indigo dread.", [], ["Pack Ice Field"], []],
  // 24
  ["Medium shot of a somber early-Victorian crowd in dark clothing reading a grim newspaper notice posted on a wall, heads bowed, cold grey mournful tone.", [], [], []],
  // 25
  ["Wide shot of towering jagged ice cliffs and a dark churning lead of black water in the Pack Ice Field, oppressive and deadly, deep cold shadows.", [], ["Pack Ice Field"], []],
  // 26
  ["Wide shot of a lone wooden expedition ship sailing north between ice floes toward a pale horizon, small and determined, cool hopeful light.", [], ["Pack Ice Field"], []],
  // 27
  ["Wide shot of a small group of Inuit figures in fur clothing standing on a snowy coast beside a snow-block dwelling, at home in the frozen landscape, warm-neutral daytime light.", [], [], []],
  // 28
  ["Medium shot of an Inuit man in fur clothing setting a block of snow onto a half-built dome snow house, careful and skilled, soft cool daytime light.", [], [], []],
  // 29
  ["Wide shot of an Inuit driver on The Wooden Sledge pulled by a fanned-out team of husky dogs racing across the frozen sea, the motion of the run, crisp cold daytime light.", [], ["Pack Ice Field"], ["The Wooden Sledge"]],
  // 30
  ["Medium shot of an Inuit hunter paddling a slender skin kayak across dark open Arctic water, calm and balanced, cool blue tone.", [], [], []],
  // 31
  ["Medium shot of a fur-clad Western explorer standing and watching an Inuit hunter work in the snow with dawning respect, his hand at his chin. Cool daytime light.", [], [], []],
  // 32
  ["Wide shot of a Western explorer and an Inuit hunter standing together on the ice looking toward the horizon, a partnership forming, warm-cool balanced light.", [], [], []],
  // 33
  ["Medium portrait shot of Robert standing tall on the Pack Ice Field in his fur parka, his large mustache and stern gaze fixed on the horizon, cold heroic light. Robert stands firm against the wind.", ["Robert"], ["Pack Ice Field"], []],
  // 34
  ["Medium shot of Young Robert in his navy engineer uniform standing in a lush green Central American jungle clearing, wiping his brow, warm humid golden light. Young Robert gazes thoughtfully into the distance.", ["Young Robert"], [], []],
  // 35
  ["Medium shot of Young Robert bent over a surveyor's tripod instrument in the jungle, focused on his measurement, dappled warm daylight.", ["Young Robert"], [], []],
  // 36
  ["Close-up of Young Robert's gloved hands spreading an engineering canal survey drawing across a field table, warm daylight. Young Robert traces a line on the plan.", ["Young Robert"], [], []],
  // 37
  ["Medium shot of Young Robert sitting alone at a desk with his rolled canal plans pushed aside, shoulders slumped in disappointment, dim cool lamplight.", ["Young Robert"], [], []],
  // 38
  ["Medium shot of Young Robert seated by a window reading a book about Arctic exploration, an intent spark in his eyes, warm lamp glow. Young Robert leans closer to the page.", ["Young Robert"], [], []],
  // 39
  ["Close-up of Young Robert's face lit with sudden fierce ambition as he looks up from the book, determination igniting. Warm dramatic light.", ["Young Robert"], [], []],
  // 40
  ["Wide shot of Young Robert in a travel coat walking up a gangplank onto a steamship at New York Harbor, a bag in hand, setting off. Cool morning light.", ["Young Robert"], ["New York Harbor"], []],
  // 41
  ["Wide shot of Young Robert striding confidently onto the Greenland Ice Cap followed by two Inuit guides, the vast white plateau ahead. Cool bright daytime light. Young Robert leads the way.", ["Young Robert"], ["Greenland Ice Cap"], []],
  // 42
  ["Medium shot of Young Robert bracing against a fierce snow-wind on the Greenland Ice Cap, hunched and straining, his confidence breaking. Harsh cold blue-white tone.", ["Young Robert"], ["Greenland Ice Cap"], []],
  // 43
  ["Wide shot of Young Robert halting at the edge of a splitting crack in the Greenland Ice Cap, raising a hand to signal retreat, a loaded sledge behind him. Tense cold light.", ["Young Robert"], ["Greenland Ice Cap"], ["The Wooden Sledge"]],
  // 44
  ["Wide shot of Young Robert standing on the Greenland Ice Cap looking back across the vast distance he crossed, weary but proud. Pale cold daytime light.", ["Young Robert"], ["Greenland Ice Cap"], []],
  // 45
  ["Medium shot of Robert at a study desk in a Washington home, staring restlessly at an Arctic map on the wall, ambition unquenched. Warm lamplight.", ["Robert"], [], []],
  // 46
  ["Close-up of Robert's hand writing a letter by candlelight at a desk, his focused mustached face above, warm intimate glow. Robert writes intently.", ["Robert"], [], []],
  // 47
  ["Medium shot of Robert pausing over his letter and looking up with quiet burning resolve, warm lamplight on his face.", ["Robert"], [], []],
  // 48
  ["Medium shot of Robert standing beside stacked bundles of Arctic animal furs at a trading counter, gesturing as he offers them for sale, warm daylight. Robert presents the furs.", ["Robert"], [], []],
  // 49
  ["Medium two-shot of Robert and Matthew meeting at a fur trader's shop, Robert regarding Matthew with keen interest while Matthew stands attentively. Warm daylight.", ["Robert", "Matthew"], [], []],
  // 50
  ["Medium shot of Young Matthew as a thirteen-year-old cabin boy coiling rope on the deck of an 1870s merchant sailing ship, small among the rigging, warm sea light. Young Matthew works the rope.", ["Young Matthew"], [], []],
  // 51
  ["Medium shot of Matthew at a workbench skillfully planing a piece of wood, tools around him, focused and capable, warm workshop light. Matthew works the plane.", ["Matthew"], [], []],
  // 52
  ["Medium two-shot of Robert nodding approvingly toward Matthew in a study, Matthew standing ready and eager. Warm lamplight. Robert gestures him aboard.", ["Robert", "Matthew"], [], []],
  // 53
  ["Medium shot of Robert and Matthew leaning over an Arctic map spread on a table, Robert pointing at the map while Matthew studies it. Warm amber lamplight.", ["Robert", "Matthew"], [], []],
  // 54
  ["Medium portrait shot of Young Frederick in a dark physician's coat standing in a doorway, earnest and composed, cool daylight. Young Frederick meets the viewer's gaze steadily.", ["Young Frederick"], [], []],
  // 55
  ["Medium shot of Young Frederick sitting alone and grief-stricken in a dim room beside an empty cradle, head lowered, cold sorrowful blue tone. Young Frederick bows his head.", ["Young Frederick"], [], []],
  // 56
  ["Medium shot of Young Frederick pausing on a city street to read an Arctic expedition recruitment notice pinned to a board, a new purpose in his eyes, cool daylight. Young Frederick studies the notice.", ["Young Frederick"], [], []],
  // 57
  ["Medium two-shot of Robert appraising Young Frederick across a desk and giving a curt nod of acceptance, Young Frederick standing hopeful. Warm lamplight.", ["Robert", "Young Frederick"], [], []],
  // 58
  ["Wide shot of Robert leading a small expedition party across the Greenland Ice Cap with a loaded sledge, Robert at the front. Cool bright polar daytime light.", ["Robert"], ["Greenland Ice Cap"], ["The Wooden Sledge"]],
  // 59
  ["Medium shot inside a tent of Young Frederick kneeling to splint Robert's injured leg, Robert lying back gritting his teeth. Warm lamplight in the shelter. Young Frederick binds the splint.", ["Young Frederick", "Robert"], [], []],
  // 60
  ["Medium shot of Young Frederick standing in fur clothing at the door of a snow shelter on the Greenland Ice Cap, transformed and hardened, looking out at the ice. Cool daytime light. Young Frederick surveys the frozen land.", ["Young Frederick"], ["Greenland Ice Cap"], []],
  // 61
  ["Wide shot of Young Frederick driving a husky-dog sledge across fractured sea ice, learning the craft, an Inuit hunter beside him. Crisp cold daytime light. Young Frederick grips the sledge.", ["Young Frederick"], ["Pack Ice Field"], ["The Wooden Sledge"]],
  // 62
  ["Medium shot of Young Frederick placing a block of snow onto a shelter wall on the empty white plain of the Greenland Ice Cap, working steadily in the cold. Pale cool light. Young Frederick sets the snow block.", ["Young Frederick"], ["Greenland Ice Cap"], []],
  // 63
  ["Medium shot of Young Frederick sitting with an Inuit hunter inside a snow shelter, speaking and gesturing as he learns the language, warm lamp glow. Young Frederick speaks earnestly.", ["Young Frederick"], [], []],
  // 64
  ["Medium two-shot of Robert clasping Young Frederick's shoulder in respect aboard the Ship Deck, inviting him onward, cool sea daylight. Robert grips his shoulder.", ["Robert", "Young Frederick"], ["Ship Deck"], []],
  // 65
  ["Medium two-shot of Robert and Young Frederick standing apart on the Ship Deck, a cold distance opening between them, both looking away. Cool blue tension.", ["Robert", "Young Frederick"], ["Ship Deck"], []],
];
