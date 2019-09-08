'use strict';

export default class Tabu {
    constructor(maxTabuSize, maxIterations) {
        this.maxTabuSize = maxTabuSize;
        this.maxIterations = maxIterations;
    }

    search(sampleSpace) {
        
        let neighborMap = this.generateNeighbors(sampleSpace);
        let initialSolution = this.generateInitialSolution(sampleSpace, neighborMap);
        let initialSolutionCost = this.findSolutionDistance(initialSolution);

        let tabuList = [];
        let bestSolution = initialSolution;
        let bestCost = initialSolutionCost;

        let counter = 0;
        
        while (counter <= maxIterations) {
            let neigborhood = this.getNeighbors(initialSolution, neighborMap);
            let bestSolutionIndex = 0;
            bestSolution = neigborhood[bestSolutionIndex];
            bestCostIndex = bestSolution.length - 1;

            isFound = false;

            while(!isFound) {
                i = 0
                while (i<bestSolution.length) {
                    if (bestSolution[i] != solution[i]) {
                        firstExchangeNode = bestSolution[i]
                        secondExchangeNode = solution[i]
                        break;
                    }
                    i++
                }

                if (condition) {
                    tabuList.append([firstExchangeNode, secondExchangeNode])
                    isFound = true
                    solution = bestSolution[1]

                    cost = neigborhood[bestSolutionIndex][bestCostIndex]
                    if(cost<bestCost) {
                        bestCost = cost;
                        bestSolution = solution;
                    }
                } else {
                        bestSolutionIndex = bestSolutionIndex + 1
                        bestSolution = neigborhood[bestSolutionIndex]
                }
            }

            if(tabuList.length > this.maxTabuSize) {
                // Pop
            }

            counter++

        }
        
        return bestSolution;
    }

    // Find neighboring solutions sorted by cost
    getNeighbors(solution, neighborMap) {
        let solutionNeighborhood = []

        for(let i=1; i<solution.length-1; i++) {
            let n = solution[i]
            for(let j=1; j<solution.length-1; j++) {
                let kn = solution[j]

                if(n == kn) {
                    continue;
                }

                let tempArray = Array.from(solution)
                tempArray[i] = kn 
                tempArray[j] = n

                let distance = 0
                for(let k=0; k<solution.length-1; k++) {
                    let nextNode = tempArray[k + 1]

                    let mapIndex = 0
                    neighborMap.get(k).forEach(value, key => {
                        if (key == nextNode) {
                            distance = distance + value;
                        }    
                    });
                }

                tempArray.append(distance)

                if (!solutionNeighborhood.includes(tempArray)) {
                    solutionNeighborhood.append(tempArray)   
                }
            }
        }

        solutionNeighborhood = solutionNeighborhood.sort(function(a, b) {
            return a[length-1] > b[length-1] ? 1:-1;
        });

        return solutionNeighborhood;
    }

    
    generateInitialSolution(nodes, neighborMap) {
        let startNode = nodes[0]
        let endNode = startNode

        let initialSolution = []
        let cost = 0
        let visiting = startNode
        let preNode = null 

        while (initialSolution.includes(visiting)) {

            let tempMap = new Map(neighborMap.get(visiting));
            // Find the node with minimum distance to visiting node and call it next Node
            let nextNodeValue = Math.min([...map.values()])
            let nextNode = [...temMap.entries()].filter(({ 1: v }) => v === 'nextNodeValue').map(([k]) => k);
            initialSolution.push(visiting)
            preNode = visiting
            visiting = nextNode
        }

        initialSolution.push(nodes[0])
        return initialSolution;
    }

    generateNeighbors(points) {
        let neighborMap = new Map()
        for(let i=0; i<points.length; i++) {
            for(let j=i+1; j<points.length; j++) {
                if(!neighborMap.has(points[i])) {
                    neighborMap.set(points[i], new Map());
                    neighborMap.get(points[i]).set(points[j], this.distance(points[i], points[j]));
                } else {
                    neighborMap.get(points[i]).set(points[j], this.distance(points[i], points[j]));
                }

                if(!neighborMap.has(points[j])) {
                    neighborMap.set(points[j], new Map());
                    neighborMap.get(points[j]).set(points[i], this.distance(points[j], points[i]));
                } else {
                    neighborMap.get(points[j]).set(points[i], this.distance(points[i], points[j]));
                }
            }
        }

        return neighborMap
    }

    findSolutionDistance(solution) {
        let solutionDistance = 0;
        for(let i=0; i<solution.length-1; i++) {
            solutionDistance = solutionDistance + this.distance(solution[i], solution[i+1]);
        }

        return solutionDistance;
    }

    distance(firstPoint, secondPoint) {
        return Math.sqrt(Math.pow(firstPoint.x - secondPoint.x, 2) + Math.pow(firstPoint.y - secondPoint.y, 2));
    }
}
