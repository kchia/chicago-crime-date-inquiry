import React, { Component } from 'react';

//BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import { Row, Col, Button } from 'react-bootstrap';
import { MdPlayArrow } from 'react-icons/md';
import { IconContext } from 'react-icons';
import DatePicker from 'react-date-picker';
import DateAdder from 'date-and-time';

//CSS
import './DateChanger.css';

class DateChanger extends Component {
	addDay = () => {
		this.shiftDateByInteger(1);
	};

	subtractDay = () => {
		this.shiftDateByInteger(-1);
	};

	shiftDateByInteger = (amount) => {
		this.props.setDate(DateAdder.addDays(this.props.date, amount));
	};

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<Button variant='dark' onClick={this.subtractDay}>
							<IconContext.Provider
								value={{
									style: { transform: 'scaleX(-1)' },
								}}>
								<MdPlayArrow />
							</IconContext.Provider>
						</Button>
					</Col>
					<Col>
						<DatePicker value={this.props.date} onChange={this.props.setDate} />
					</Col>
					<Col>
						<Button variant='dark' onClick={this.addDay}>
							<MdPlayArrow />
						</Button>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default DateChanger;
