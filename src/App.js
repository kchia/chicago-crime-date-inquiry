import React, { Component } from 'react';
import './App.css';

//BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom';

//COMPONENTS
import Header from './components/Header/Header';
import Home from './components/Home';

//QUERY HELPERS
import { AllCrimeByTypeFromSingleDate } from './queries/AllCrimeByTypeFromSingleDate/AllCrimeByTypeFromSingleDate';
import { AllCrimeByDate } from './queries/AllCrimeByDate/AllCrimeByDate';
import { AllCrimeByMonth } from './queries/AllCrimeByMonth/AllCrimeByMonth';
import { SingleYear } from './queries/SingleYear/SingleYear';
import { SingleMonth } from './queries/SingleMonth/SingleMonth';
import { SingleDay } from './queries/SingleDay/SingleDay';

import ZoomLevel from './helpers/ZoomLevel';

class App extends Component {
	constructor() {
		super();
		this.state = {
			allCrimeByTypeFromSingleDate: new Date(),
			allCrimeByTypeFromSingleDateData: undefined,
			allCrimeByDate: undefined,
			barGraphLocked: false,
			singleRowLock: false,
			lineGraphLock: false,
			allCrimeByMonth: undefined,
			selectedSingleYear: undefined,
			allCrimeBySingleYear: undefined,
			lineGraphColor: undefined,
			allCrimeBySingleMonth: undefined,
			selectedSingleMonth: undefined,
			selectedSingleDay: undefined,
			allCrimeBySingleDay: undefined,
			zoomLevel: ZoomLevel.ALL,
			perviousSelectedDay: undefined,
			perviousSelectedYear: undefined,
			perviousSelectedMonth: undefined,
		};
	}

	componentDidMount() {
		this.getAllCrimeByTypeFromSingleDate(
			this.state.allCrimeByTypeFromSingleDate
		);
		this.getAllCrimeByDate();
		this.getAllCrimeByMonth();
	}

	callOnErrorDefault = (error) => {
		console.log(error);
	};

	getAllCrimeByTypeFromSingleDate = (date) => {
		this.setState({ singleRowLock: true, barGraphLocked: true });
		let self = this;
		AllCrimeByTypeFromSingleDate(
			date,
			function (results) {
				self.setState({
					allCrimeByTypeFromSingleDateData: results,
					singleRowLock: false,
					barGraphLocked: false,
				});
			},
			this.callOnErrorDefault
		);
	};

	getCrimeDataBySingleYear = (year) => {
		if (year !== undefined) {
			this.setState({ lineGraphLock: true });
			let self = this;
			SingleYear(
				year,
				function (results) {
					self.setState({
						allCrimeBySingleYear: results,
						lineGraphLock: false,
					});
				},
				this.callOnErrorDefault
			);
		}
	};

	getCrimeDataBySingleMonth = (year, month) => {
		if (year !== undefined && month !== undefined) {
			this.setState({ lineGraphLock: true });
			let self = this;
			SingleMonth(
				year,
				month,
				function (results) {
					self.setState({
						allCrimeBySingleMonth: results,
						lineGraphLock: false,
					});
				},
				this.callOnErrorDefault
			);
		}
	};

	getCrimeDataBySingleDay = (year, month, day) => {
		if (year !== undefined && month !== undefined && day !== undefined) {
			this.setState({ lineGraphLock: true });
			let self = this;
			SingleDay(
				year,
				month,
				day,
				function (results) {
					self.setState({
						allCrimeBySingleDay: results,
						lineGraphLock: false,
					});
				},
				this.callOnErrorDefault
			);
		}
	};

	setAllCrimeByTypeFromSingleDate = (date) => {
		this.setState({
			allCrimeByTypeFromSingleDate: date,
		});
		this.getAllCrimeByTypeFromSingleDate(date);
	};

	getAllCrimeByDate() {
		let self = this;
		this.setState({ lineGraphLock: true });
		AllCrimeByDate(function (results) {
			self.setState({ allCrimeByDate: results, lineGraphLock: false });
		}, this.callOnErrorDefault);
	}

	getAllCrimeByMonth() {
		let self = this;
		this.setState({ lineGraphLock: true });
		AllCrimeByMonth(function (results) {
			self.setState({ allCrimeByMonth: results, lineGraphLock: true });
		}, this.callOnErrorDefault);
	}

	setSelectedSingleYear = (year) => {
		this.setState({
			perviousSelectedYear:
				this.state.selectedSingleYear || this.state.perviousSelectedYear,
			selectedSingleYear: year,
			zoomLevel: year === undefined ? ZoomLevel.ALL : ZoomLevel.YEAR,
		});
		this.getCrimeDataBySingleYear(year);
	};

	setSelectedSingleYearFromLegend = (year) => {
		this.setState({
			perviousSelectedYear: undefined,
			perviousSelectedMonth: undefined,
			perviousSelectedDay: undefined,
			selectedSingleYear: year,
			zoomLevel: year === undefined ? ZoomLevel.ALL : ZoomLevel.YEAR,
		});
		this.getCrimeDataBySingleYear(year);
	}

	setSelectedSingleDay = (day) => {
		if (
			this.state.selectedSingleYear !== undefined &&
			this.state.selectedSingleMonth !== undefined
		) {
			this.setState({
				perviousSelectedDay:
					this.state.selectedSingleDay || this.state.perviousSelectedDay,
				selectedSingleDay: day,
				zoomLevel: day === undefined ? ZoomLevel.MONTH : ZoomLevel.DAY,
			});
			this.getCrimeDataBySingleDay(
				this.state.selectedSingleYear,
				this.state.selectedSingleMonth,
				day
			);
		}
	};

	setSelectedSingleMonth = (month) => {
		if (this.state.selectedSingleYear !== undefined) {
			this.setState({
				perviousSelectedMonth:
					this.state.selectedSingleMonth || this.state.perviousSelectedMonth,
				selectedSingleMonth: month,
				zoomLevel: month === undefined ? ZoomLevel.YEAR : ZoomLevel.MONTH,
			});
			this.getCrimeDataBySingleMonth(this.state.selectedSingleYear, month);
		}
	};

	setLineGraphColor = (color) => {
		this.setState({ lineGraphColor: color });
	};

	render() {
		return (
			<Container
				className={
					this.state.dateChangerLocked
						? 'anyGraphsLoading mainAppContainer'
						: 'mainAppContainer'
				}>
				<HashRouter basename='/'>
					<Header />
					<main>
						<Switch>
							<Route
								exact
								path='/home'
								render={() => (
									<Home
										barGraphLocked={this.state.barGraphLocked}
										mainGraphData={this.state.allCrimeByTypeFromSingleDateData}
										allCrimeByTypeFromSingleDate={
											this.state.allCrimeByTypeFromSingleDate
										}
										setAllCrimeByTypeFromSingleDate={
											this.setAllCrimeByTypeFromSingleDate
										}
										allCrimeByDate={this.state.allCrimeByDate}
										allCrimeByMonth={this.state.allCrimeByMonth}
										selectedSingleYear={this.state.selectedSingleYear}
										allCrimeBySingleYear={this.state.allCrimeBySingleYear}
										setSelectedSingleYear={this.setSelectedSingleYear}
										setLineGraphColor={this.setLineGraphColor}
										lineGraphColor={this.state.lineGraphColor}
										setSelectedSingleMonth={this.setSelectedSingleMonth}
										lineGraphLock={this.state.lineGraphLock}
										singleRowLock={this.state.singleRowLock}
										selectedSingleMonth={this.state.selectedSingleMonth}
										allCrimeBySingleMonth={this.state.allCrimeBySingleMonth}
										setSelectedSingeMonth={this.setSelectedSingeMonth}
										setSelectedSingleDay={this.setSelectedSingleDay}
										selectedSingleDay={this.state.selectedSingleDay}
										allCrimeBySingleDay={this.state.allCrimeBySingleDay}
										zoomLevel={this.state.zoomLevel}
										perviousSelectedDay={this.state.perviousSelectedDay}
										perviousSelectedYear={this.state.perviousSelectedYear}
										perviousSelectedMonth={this.state.perviousSelectedMonth}
										setSelectedSingleYearFromLegend={
											this.setSelectedSingleYearFromLegend
										}
									/>
								)}
							/>
							<Redirect path='*' to='/home' />
						</Switch>
					</main>
				</HashRouter>
			</Container>
		);
	}
}

export default App;
