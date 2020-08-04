import React from 'react';  
import Cell from './cell';

export default class Grid extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            xSize: 50,
            ySize: 50,
            steps: 0,
            speed: 100,
            gameStarted: false,
            theGrid: [],
            nextGrid: [],
        }
        this.clickCell = this.clickCell.bind(this);
    }

    componentDidMount(){
        this.setupGame(false)
    }

    createArray(rows) {
        let arr = [];
        for(let i=0; i <= rows; i++) { 
            arr[i] = [];
        }
        return arr;
    }

    setupGame(randomGame) {
        //randomGame can be true or false, if true: random game
        let theGrid = this.createArray(this.state.xSize);
        let reactGrid = this.createArray(this.state.xSize);
        
        for(let j=0; j <= this.state.xSize; j++) { 
            for(let k=0; k <= this.state.ySize; k++) { 
                let alive = 0;
                if(randomGame) {
                    alive = Math.round(Math.random());
                }
                theGrid[j][k] = alive;
            }
        }

        for(let j=0; j <= this.state.xSize; j++) { 
            for(let k=0; k <= this.state.ySize; k++) { 
                reactGrid[j][k] = <Cell x={j} y={k} key={j+"x"+k+"y"} alive={theGrid[j][k]} clickFunction={this.clickCell}/>
            }
        }
        this.setState({
            theGrid: theGrid,
            nextGrid: theGrid,
            gridToRender: reactGrid
        })
    }

    createEmptyGrid() {
        let theGrid = this.createArray(this.state.xSize);
        for(let j=0; j <= this.state.xSize; j++) { 
            for(let k=0; k <= this.state.ySize; k++) { 
                theGrid[j][k] = 0;
            }
        }
        return(theGrid)
    }

    clickCell(x, y) {
        //set alive depending on prev. state
        let theGrid = this.state.theGrid;
        let nextGrid = this.state.theGrid

        if(theGrid[x][y] === 0) {
            nextGrid[x][y] = 1;
        } else {
            nextGrid[x][y] = 0;
        }
        
        //prepare react objects
        let reactGrid = this.createArray(this.state.xSize);
        for(let j=0; j <= this.state.xSize; j++) { 
            for(let k=0; k <= this.state.ySize; k++) { 
                reactGrid[j][k] = <Cell x={j} y={k} key={j+"x"+k+"y"} alive={nextGrid[j][k]} clickFunction={this.clickCell}/>
            }
        }

        this.setState({
            theGrid: nextGrid,
            nextGrid: nextGrid,
            gridToRender: reactGrid
        })
    }

    nextTick() {
        this.setState({
            steps: this.state.steps + 1
        }, this.updateGrid)
    }
    

    updateGrid() {
        let theGrid = this.state.theGrid;
        let nextGrid = this.createEmptyGrid();
        let reactGrid = this.createArray(this.state.xSize);

        for(let j=0; j <= this.state.xSize; j++) { 
            for(let k=0; k <= this.state.ySize; k++) { 
                var totalCells = 0;
                //add up the total values for the surrounding cells
                if(j-1 >= 0 && k-1 >= 0) {
                    totalCells += theGrid[j - 1][k - 1]; //top left
                }
                if(j-1 >= 0 && k >= 0) {
                    totalCells += theGrid[j - 1][k]; //top center
                }
                if(j-1 >= 0 && k+1 <= this.state.ySize) { 
                    totalCells += theGrid[j - 1][k + 1]; //top right
                }
                if(j >= 0 && k-1 >= 0) {
                    totalCells += theGrid[j][k - 1]; //middle left
                }
                if(j >= 0 && k + 1 <= this.state.ySize) {
                    totalCells += theGrid[j][k + 1]; //middle right
                }
                if(j+1 <= this.state.xSize && k-1 >= 0) { 
                    totalCells += theGrid[j + 1][k - 1]; //bottom left
                }
                if(j+1 <= this.state.xSize && k >= 0) { 
                    totalCells += theGrid[j + 1][k]; //bottom center
                }
                if(j+1 <= this.state.xSize && k+1 <= this.state.ySize) { 
                    totalCells += theGrid[j + 1][k + 1]; //bottom right
                }

	            switch (totalCells) {
	                case 2:
                        // Any live cell with two live neighbours survives.
                        nextGrid[j][k] = theGrid[j][k];
	                    break;
	                case 3:
                        // Any dead cell with three live neighbours becomes a live cell.
                        // Any live cell with three live neighbours survives.
                        nextGrid[j][k] = 1
	                    break;
	                default:
                        // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                        nextGrid[j][k] = 0
	            }
            }
        } 


        for(let j=0; j <= this.state.xSize ; j++) { 
            for(let k=0; k <= this.state.ySize ; k++) { 
                reactGrid[j][k] = <Cell x={j} y={k} key={j+"x"+k+"y"} alive={nextGrid[j][k]} clickFunction={this.clickCell}/>
            }
        }        
        
        // swap grids and render
        this.setState({
            theGrid: nextGrid,
            nextGrid: this.createEmptyGrid(),
            gridToRender: reactGrid            
        })
    }

    render () {
        return(
            <div>
                <div>
                    Steps: {this.state.steps}
                </div>
                <button onClick={() => this.setupGame(true)}>
                    Random
                </button>
                <button onClick={this.nextTick.bind(this)}>
                    NEXT
                </button>
                <button onClick={() => setInterval(this.nextTick.bind(this), this.state.speed)}>
                    LOOP
                </button>
                <div className="grid">
                    {this.state.gridToRender}
                </div>
            </div>
        );
    }
}
