import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Container, Row } from 'react-bootstrap';
import './BarGraphDisplay.css';
import GetColor from '../../helpers/GetColor';
import LoadingSpinner from '../LoadingSpinner';
import DataTotal from '../DataTotal';
import Numeral from 'numeral';

class BarGraphDisplay extends Component {
	render() {
		if (this.props.data !== undefined) {
			return (
				<Container>
					<h3 className='text-center'>{`All Crimes Reported on ${this.props.displayDate}`}</h3>
					<Row
						style={{ height: this.props.graphHeight }}
						className={this.props.locked && 'graphLoading'}>
						<ResponsiveBar
							data={this.createDisplayData(this.props.data)}
							keys={Object.keys(this.props.data)}
							indexBy='keyDisplay'
							margin={{ top: 10, right: 130, bottom: 70, left: 60 }}
							padding={0.3}
							colors={GetColor}
							borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
							axisTop={null}
							axisRight={null}
							axisBottom={{
								tickSize: 5,
								tickPadding: 5,
								tickRotation: 90,
								legend: this.props.axisBottomLegend,
								legendPosition: 'middle',
								legendOffset: 53,
							}}
							axisLeft={{
								tickSize: 5,
								tickPadding: 5,
								tickRotation: 0,
								legend: this.props.axisLeftLegend,
								legendPosition: 'middle',
								legendOffset: -52,
							}}
							labelSkipWidth={12}
							labelSkipHeight={12}
							labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
							animate={true}
							motionStiffness={90}
							motionDamping={15}
						/>
					</Row>
					<DataTotal
						header={`Total Crime Reported on ${this.props.displayDate}`}
						total={this.getTotal(this.props.data)}
					/>
				</Container>
			);
		} else {
			return <LoadingSpinner height={this.props.graphHeight} />;
		}
	}

	getTotal= (data) => {
		let total = 0;
		for (let key of Object.keys(data)) {
			total += data[key];
		}
		return total;
	}

	createDisplayData = (data) => {
		const displayData = [];
		let activeDisplayKeys = [];
		Object.keys(data).forEach((key) => {
			let column = {};
			column[key] = data[key];
			column.amount = data[key];
			let newColumnData = this.getKeyDisplay(key, activeDisplayKeys);
			column.keyDisplay = newColumnData.keyDisplay;
			activeDisplayKeys = newColumnData.activeDisplayKeys;
			displayData.push(column);
		});
		return displayData;
	};

	getKeyDisplay(key, activeDisplayKeys) {
		if (key.length > 4) {
			key = key.replace(' ', '');
			let keyDisplay = key.substring(0, 4);
			let offSet = 1;
			while (activeDisplayKeys.includes(keyDisplay)) {
				let max = key.length < 4 + offSet ? key.length : 4 + offSet;
				keyDisplay = key.substring(0 + offSet, max);
				offSet++;
			}
			activeDisplayKeys.push(keyDisplay);
			return { keyDisplay, activeDisplayKeys };
		} else {
			return key;
		}
	}
}

export default BarGraphDisplay;
