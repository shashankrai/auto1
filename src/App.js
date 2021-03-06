// @flow
import type { Node } from 'react';
import './App.scss';
import { Container, Row, Col,Form ,Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Car from './GetCar';
import Pagination from './components/pagination';
import {GET_CARS_URL,GET_MANUFACTURERES_URL, GET_COLOR_URL} from './config'
import { LOCALE} from './constants'

const App =(): Node=> {
  const [cars, setCars] = useState([]);
  const [loading, setloading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [color, setColor] = useState([]);
  const [manufacturerName, setmanufacturerName] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars ,setTotalCars] = useState(0);
  const {colorLabel,manufacturerLabel,filterBtn,sort,
    defaultColor,defaultManufactures,result,showing,of,availableCars} =LOCALE;


  const getHeaders = () =>{
        const defaultHeader = {};
        if (selectedColor) {
          defaultHeader.color =selectedColor;
        }
        if (selectedType) {
          defaultHeader.manufacturer =selectedType;
        }
        defaultHeader.sort =sort;
        defaultHeader.page =currentPage.toString();
        return defaultHeader;   
  }

  useEffect(() => {
      const headers = getHeaders();
      fetch(GET_CARS_URL + new URLSearchParams(headers))
      .then(results => results.json())
      .then(data => {
        setCars(data.cars);
        setPageCount(data.cars.length);
        setTotalPages(data.totalPageCount);
        setTotalCars(data.totalCarsCount)
        setloading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  useEffect(() => {
    Getcolor();
    GetManufacturer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const Getcolor =() =>{
    fetch(GET_COLOR_URL)
    .then(results => results.json())
      .then(data => {
        const colorsData = data.colors;
        colorsData.unshift(defaultColor);
        setColor(colorsData);
      });

   }

  const GetManufacturer =() =>{
    fetch(GET_MANUFACTURERES_URL)
    .then(results => results.json())
      .then(data => {
        const manufacturer = data.manufacturers.map(item => item.name);
        manufacturer.unshift(defaultManufactures);
        setmanufacturerName(manufacturer);
      });

   }

  const onChangeColor =(event) =>{
    setSelectedColor(event.target.value);
  }

  const onChangeManufacture =(event) =>{
    setSelectedType(event.target.value);
  }

  const paginate = (pageNumber) =>{
    setCurrentPage(pageNumber);
  }
   
  const onFormSubmit =(event) => {
    const { filterSelectMessage } = LOCALE;
    event.preventDefault();
    if(selectedType===null && selectedColor===null ){
      alert(filterSelectMessage);
    } else{
      const headers = getHeaders();
      fetch(GET_CARS_URL + new URLSearchParams(headers))
        .then(results => results.json())
        .then(data => {
          setCars(data.cars);
          setPageCount(data.cars.length);
          setTotalPages(data.totalPageCount);
          setTotalCars(data.totalCarsCount);
        });

    }
  
  }

  return (
      <Container fluid>
        <Row>
          <Col sm="4">
            <div className="filter">
                <Form onSubmit={onFormSubmit}>
                  <fieldset>
                    <Form.Group>
                      <Form.Label htmlFor="customSelectcolor">{colorLabel}</Form.Label>
                      <Form.Control as="select"  onChange={(e) => onChangeColor(e)} className="customSelect" id ="customSelectcolor" data-testid ="customSelectcolor">
                        <>
                          {color.map((item,index) => (
                              <option  key={`${index}:${item}`} value ={item}>{item}</option>
                          ))}
                        </>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="customSelectmanufactured">{manufacturerLabel}</Form.Label>
                      <Form.Control as="select" id="customSelectmanufactured" onChange={(e) => onChangeManufacture(e)} data-testid="manuFacturing">
                      {manufacturerName.map((item,index) => (
                            <option key={`${index}:${item}`} value ={item}>{item}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Button type="submit" className="custom-filterBtn float-right" data-testid="filterBtn">{filterBtn}</Button>
                  </fieldset>
                </Form>
            </div>
          </Col>
          <Col sm="8">
            <p className="headingMain" >{availableCars}</p>
            <p className="headingSubmain" data-testid="pageCount">{`${showing} ${pageCount} ${of} ${totalCars} ${result}`}</p>
            <Car data={cars} loading ={loading}></Car>
            <Pagination
              currentPage ={currentPage}
              totalPages ={totalPages}
              paginate={paginate}
           />
          </Col>
        </Row>
      </Container>
  );
}


export default App;
