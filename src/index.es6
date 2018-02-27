'use strict';

export default class Tabu {

    search(sampleSpace, tabuListSize, candidateListSize, maxIterations) {
        
        let sampleCandidate = getRandomCandidate();
        let bestCandidate = sampleCandidate;
        let searchSolution = sampleCandidate;

        let counter = 0;
        let tabuList = [];

        tabuList.push(sampleCandidate);

        while (counter <= maxIterations) {
            neigborhoodCandidates = getNeighbors(bestCandidate);

            // update bestCandidate to the first neighbour candidate
            bestCandidate = neigborhoodCandidates[0];

            for (candidate in neigborhoodCandidates) {
                // if candidate not in tabu list and has greater fitness than current best
                if ((!tabuList.includes(candidate)) && (fitness(candidate) > fitness(bestCandidate))){
                    bestCandidate = candidate;
                }
            }
            if (fitness(bestCandidate) > fitness(searchSolution)) {
                searchSolution = bestCandidate;
            }

            tabuList.push(bestCandidate);

            if (tabuList.size > maxTabuSize) {
                tabuList.removeFirst()
            }
        }

        return searchSolution;
    }

    fitness(candidate) {
        return 0;
    }

    getNeighbors(candidate) {
        return [];
    }

    getRandomCandidate(sampleSpace) {
        return null;
    }
}