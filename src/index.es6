'use strict';
const {JavaMap} = require('javasetmap.ts')

Array.prototype.equals = function (o) { 
    return this == o || this.length == o.length && this.every((el, i) => el.equals(o[i])) 
}
Array.prototype.hashCode = function () { 
    return this.reduce((acc, current) => acc * 31 + current.hashCode(), 0) 
}
Number.prototype.equals = function (o) { return this == o }
Number.prototype.hashCode = function () { return this | 0 }

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
        let solution = initialSolution;
        let bestSolutionEver = solution;
        let bestCost = initialSolutionCost;

        let counter = 1;
        
        while (counter <= maxIterations) {
            console.log('Iteration: ' + counter + ', Best cost achieved: ' + this.findSolutionDistance(bestSolutionEver))
            let neighborhood = this.getNeighbors(solution, neighborMap);
            
            let bestSolutionIndex = 0;
            let bestSolution = Array.from(neighborhood[bestSolutionIndex]);
            let bestCostIndex = bestSolution.length - 1;

            let isFound = false;
            let firstExchangeNode = null;
            let secondExchangeNode = null;
            while(!isFound) {
                let i = 0
                
                while (i<bestSolution.length) {
                    if (JSON.stringify(bestSolution[i]) != JSON.stringify(solution[i])) {
                        firstExchangeNode = bestSolution[i]
                        secondExchangeNode = solution[i]
                        break;
                    }
                    i++
                }

                if (!tabuList.map(JSON.stringify).includes(JSON.stringify([firstExchangeNode, secondExchangeNode])) && 
                !tabuList.map(JSON.stringify).includes(JSON.stringify([secondExchangeNode, firstExchangeNode]))) {

                    tabuList.push([firstExchangeNode, secondExchangeNode])
                    
                    isFound = true
                    bestSolution.pop()
                    solution = Array.from(bestSolution)

                    let cost = neighborhood[bestSolutionIndex][bestCostIndex]
                    
                    if(cost<bestCost) {
                        bestCost = cost;
                        bestSolutionEver = solution;
                    }
                } else {
                        bestSolutionIndex = bestSolutionIndex + 1
                        bestSolution = Array.from(neighborhood[bestSolutionIndex])
                }
            }

            if(tabuList.length > this.maxTabuSize) {
                tabuList.shift()
            }

            counter++
        }
        
        return bestSolutionEver;
    }

    // Find neighboring solutions sorted by cost
    getNeighbors(solution, neighborMap) {
        let solutionNeighborhood = []

        for(let i=1; i<solution.length-1; i++) {
            let n = solution[i]
            for(let j=1; j<solution.length-1; j++) {
                let kn = solution[j]

                if(JSON.stringify(n) == JSON.stringify(kn)) {
                    continue;
                }

                let tempArray = Array.from(solution)
                tempArray[i] = kn 
                tempArray[j] = n

                let distance = 0
                for(let k=0; k<tempArray.length-1; k++) {
                    let nextNode = tempArray[k + 1]

                    let mapIndex = 0
                    neighborMap.get(tempArray[k]).forEach((value, key) => {
                        if (JSON.stringify(key) == JSON.stringify(nextNode)) {
                            distance = distance + value;
                        }    
                    });
                }
                tempArray.push(distance);
                solutionNeighborhood.push(tempArray);

            }
        }

        // Remove duplicates
        solutionNeighborhood = Array.from(new Set(solutionNeighborhood.map(JSON.stringify)), JSON.parse)

        solutionNeighborhood = solutionNeighborhood.sort(function(a, b) {
            return a[a.length-1] > b[b.length-1] ? 1:-1;
        });
        
        return solutionNeighborhood;
    }

    
    generateInitialSolution(nodes, neighborMap) {
        let startNode = nodes[0];
        let initialSolution = [];
        let visiting = startNode;
        let preNode = null;
        
        while (!initialSolution.includes(visiting) && visiting != undefined) {

            let tempMap = new JavaMap();
            neighborMap.get(visiting).forEach((value, key) => {
                tempMap.set(key, value)
            })
            for(let i=0; i<initialSolution.length; i++){
                tempMap.delete(initialSolution[i]);
            }
            
            // Find the node with minimum distance to visiting node and call it next Node
            let nextNodeValue = Math.min.apply(null, [...tempMap.values()])
            let nextNode = [...tempMap.entries()].filter(({ 1: v }) => v === nextNodeValue).map(([k]) => k)[0];

            initialSolution.push(visiting);
            preNode = visiting
            visiting = nextNode
        }

        initialSolution.push(nodes[0]);
        return initialSolution;
    }

    generateNeighbors(points) {
        let neighborMap = new JavaMap()
        for(let i=0; i<points.length; i++) {
            for(let j=i+1; j<points.length; j++) {
                if(!neighborMap.has(points[i])) {
                    neighborMap.set(points[i], new JavaMap());
                    neighborMap.get(points[i]).set(points[j], this.distance(points[i], points[j]));
                } else {
                    neighborMap.get(points[i]).set(points[j], this.distance(points[i], points[j]));
                }

                if(!neighborMap.has(points[j])) {
                    neighborMap.set(points[j], new JavaMap());
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

        return Math.sqrt(Math.pow(firstPoint[0] - secondPoint[0], 2) + Math.pow(firstPoint[1] - secondPoint[1], 2));
    }
}
