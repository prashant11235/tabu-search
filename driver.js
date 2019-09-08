// driver
let berlin52, max_iter, tabu_list_size, max_candidates, best;
 
if (true) {
  // problem configuration
  berlin52 = [
    [565, 575],
    [25, 185],
    [345, 750],
    [945, 685],
    [845, 655],
    [880, 660],
    [25, 230],
    [525, 1000],
    [580, 1175],
    [650, 1130],
    [1605, 620],
    [1220, 580],
    [1465, 200],
    [1530, 5],
    [845, 680],
    [725, 370],
    [145, 665],
    [415, 635],
    [510, 875],
    [560, 365],
    [300, 465],
    [520, 585],
    [480, 415],
    [835, 625],
    [975, 580],
    [1215, 245],
    [1320, 315],
    [1250, 400],
    [660, 180],
    [410, 250],
    [420, 555],
    [575, 665],
    [1150, 1160],
    [700, 580],
    [685, 595],
    [685, 610],
    [770, 610],
    [795, 645],
    [720, 635],
    [760, 650],
    [475, 960],
    [95, 260],
    [875, 920],
    [700, 500],
    [555, 815],
    [830, 485],
    [1170, 65],
    [830, 610],
    [605, 625],
    [595, 360],
    [1340, 725],
    [1740, 245]
  ];
 
  // algorithm configuration
  maxIterations = 100;
  tabuListSize = 15;
  max_candidates = 50;
 
  // execute the algorithm
  var Tabu =  require('./dist/index').default;
  tabu = new Tabu(tabuListSize, maxIterations);
  best = tabu.search(berlin52);
  console.log(`Done. Best Solution: c=${best["cost"]}, v=${best["vector"].inspect}`)
}
