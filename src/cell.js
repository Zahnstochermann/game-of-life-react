import React from 'react';  

export default class Cell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            // alive: this.props.alive,
            x: this.props.x,
            y: this.props.y
        }
        // this.clickCell = this.clickCell.bind(this);
    }

    render () {
        let living;
        if(this.props.alive === 1) {
            living = true;
        } else {
            living = false;
        }
        let classes = `cell ${living ? "cell--alive" : "cell--dead"}`;
        let xPosition = this.state.x * 12;
        let yPosition = this.state.y * 12;
        let style = `left: ${ xPosition}px top: ${yPosition}px`;
        
        return(
            <div className={classes} style={{top: yPosition + 'px', left: xPosition + 'px' }} onClick={() => this.props.clickFunction(this.props.x, this.props.y)}>
                {/* <span>{this.state.x}</span>|<span>{this.state.y}</span> */}
            </div>
        );
    }
}
