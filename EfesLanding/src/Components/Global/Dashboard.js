import React, { Component } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/Dashboard.css';
import logo from './images/logo.svg';
import sorteo from './images/sorteo4.svg';

import config from './config/config';
import axios from "axios";

//Librerias para el modal
import Modal from '@material-ui/core/Modal';

import {Link,Redirect} from 'react-router-dom';
 
import Confetti from 'react-confetti'

import {fire} from './config/firebase';
import swal from 'sweetalert';

const axiosInstance = axios.create({
    baseURL: config.backURL
});

class Dashboard extends Component {

    constructor(props)
    {
        super(props);
        this.state={open:false, open2:false, participantes:null, valor:'', displayConffeti:false}

        this.handleClose = this.handleClose.bind(this);
        this.handleParticipantes = this.handleParticipantes.bind(this);
        this.handlelogout = this.handlelogout.bind(this);
        this.handleGanadores = this.handleGanadores.bind(this);
        this.handleList = this.handleList.bind(this);
    }

    handleClose(){
        this.setState({...this.state.open, open:false});
        this.setState({...this.state.open2, open2:false});
    }

    handleList(){
        this.setState({...this.state.open2, open2:true});
    }

    handleParticipantes(value){
        this.setState({participantes:null});
        this.setState({...this.state.open, open:true});
        this.setState({...this.state.valor, valor:value});
        axiosInstance.get('/getParticipantes/'+value).then(res =>{
            if(res.data !== null || res.data !== ''){
                Object.keys(res.data).forEach(value => {
                    if(res.data[value].Nombre !== '' || res.data[value].Nombre !== null){
                        this.setState({participantes:res.data});
                    }
                })
            }
        })
    }

    handleGanadores(){
        console.log(this.state.valor);
        if(this.state.valor !== ''){
            axiosInstance.get('/getGanadores/'+this.state.valor).then(res =>{
                var ganadores = res.data;
                var ganador = (ganadores[Math.floor(Math.random() * ganadores.length)]);
                this.handleClose();
                this.setState({displayConffeti:true});
                swal('El Ganador es '+ ganador.Nombre , '¡Gracias por Participar!', 'success').then(value => {
                    window.location.reload();
                });
            })
        }
        else{
            alert('Ha ocurrido un error, intente más tarde.');
        }

    }

    handlelogout(){
        fire.auth().signOut();
    }

    authListener = ()=>{
        fire.auth().onAuthStateChanged((user) =>{
            if(user){
                this.setState({user});
            }
            else{
                this.setRedirect();
            }
        })
    }

        
    setRedirect = () =>{
        this.setState({ redirect: true})
    }

    renderRedirect =() =>{
        if(this.state.redirect){
          return <Redirect to='/'/>
        }
    }

    componentDidMount=() =>{
        this.authListener();
    }



    render(){
        return(
            <div id="dashboard" className="">
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    className="conffeti"
                    run={this.state.displayConffeti}
                    numberOfPieces ={500}
                />
                {this.renderRedirect()}
                <Modal open={this.state.open} onClose={this.handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    <div style={{ position: 'absolute', width: '400', backgroundColor:'white'}} className="modal-main">
                        <div className="modal-content">
                            <div className="modal-header login-header">
                                <h4 className="modal-title">Participantes</h4>
                            </div>

                            <div className="modal-body">
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table id="tabla_pagos" className="table table-striped">
                                            <thead>  
                                                <tr>
                                                    <th className="text-center"></th>
                                                    <th>Nombre</th>
                                                    <th>Cédula</th>
                                                    <th>Email</th>
                                                    <th>Teléfono</th>
                                                    <th>Fecha</th>
                                                    <th>Ubicación</th>
                                                </tr>
                                            </thead>
                                            {this.state.participantes != null ? (
                                                <tbody>
                                                    {Object.keys(this.state.participantes).map (i =>{
                                                        if(!this.state.participantes[i].Nombre){} 
                                                        return(
                                                            <tr key={i}>
                                                                <td></td>
                                                                <td>{this.state.participantes[i].Nombre}</td>
                                                                <td>{this.state.participantes[i].Cedula}</td>
                                                                <td>{this.state.participantes[i].Email}</td>
                                                                <td>{this.state.participantes[i].Telefono}</td>
                                                                <td>{this.state.participantes[i].Fecha}</td>
                                                                <td>{this.state.participantes[i].Ubicacion}</td>
                                                            </tr>

                                                        )

                                                    })}
                                                </tbody>
                                            ):(
                                                <tbody>
                                                    <tr>
                                                        <td className="p-0 text-center"></td>
                                                        <td>No hay participantes.</td>
                                                    </tr>
                                                </tbody>
                                            )}  
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel" onClick={this.handleClose}>Cerrar</button>
                                <button type="button" className="add-project" onClick={this.handleGanadores}>Seleccionar Ganador</button>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal open={this.state.open2} onClose={this.handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    <div style={{ position: 'absolute', width: '400', backgroundColor:'white'}} className="modal-main">
                        <div className="modal-content">
                            <div className="modal-header login-header">
                                <h4 className="modal-title">Listado de Códigos</h4>
                            </div>

                            <div className="modal-body">
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table id="tabla_pagos" className="table table-striped">
                                            <thead>  
                                                <tr>
                                                    <th className="text-center"></th>
                                                    <th>Código</th>
                                                </tr>
                                            </thead>
                                                <tbody>
                                                    <tr>
                                                        <td></td>
                                                        <td>2233</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>3355</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>4477</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>5599</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>6600</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>7711</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>8822</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>9944</td>
                                                    </tr>

                                                    <tr>
                                                        <td></td>
                                                        <td>0066</td>
                                                    </tr>
                                                    
                                                    <tr>
                                                        <td></td>
                                                        <td>1188</td>
                                                    </tr>
                                                </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel" onClick={this.handleClose}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </Modal>

                <div className="container-fluid display-table">
                    <div className="row display-table-row">
                        <div className="col-md-2 col-sm-1 hidden-xs display-table-cell v-align box" id="navigation">
                            <div className="col-md-2 col-sm-1 main-sidebar">
                                <div className="logo">
                                    <Link to="/"><img src={logo} alt="merkery_logo" className="hidden-xs hidden-sm"/>
                                        <img src={logo} alt="merkery_logo" className="visible-xs visible-sm circle-logo"></img>
                                    </Link>
                                </div>

                                <div className="navi">
                                    <ul>
                                        <li className="active"><i className="fa fa-home" aria-hidden="true"></i><span className="hidden-xs hidden-sm">Home</span></li>
                                        <li onClick={this.handleList}><i className="fa fa-user" aria-hidden="true"></i><span className="hidden-xs hidden-sm">Listado de Código</span></li>
                                        <li onClick={this.handlelogout}><i className="fa fa-user" aria-hidden="true"></i><span className="hidden-xs hidden-sm">Cerrar Sesión</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-10 col-sm-11 display-table-cell v-align">
                            <div className="row">
                                <header>
                                    <div className="col-md-7">
                                        <nav className="navbar-default pull-left">
                                            <div className="navbar-header">
                                                <button type="button" className="navbar-toggle collapsed" data-toggle="offcanvas" data-target="#side-menu" aria-expanded="false">
                                                    <span className="sr-only">Toggle navigation</span>
                                                    <span className="icon-bar"></span>
                                                    <span className="icon-bar"></span>
                                                    <span className="icon-bar"></span>
                                                </button>
                                            </div>
                                        </nav>

                                        <div className="search hidden-xs hidden-sm">
                                            <input type="text" placeholder="Search" id="search"/>
                                        </div>
                                    </div>
                                </header>
                            </div>
                                                
                            <div className="user-dashboard">
                                <h1>Sorteos por Tienda</h1>
                                <div className="row">
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 2233</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'2233')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 3355</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'3355')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 4477</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'4477')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 5599</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'5599')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 6600</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'6600')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 7711</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'7711')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 8822</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'8822')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>

                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 9944</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'9944')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>

                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 0066</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'0066')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>

                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <div className="card">
                                            <div className="card-statistic-4">
                                                <div className="align-items-center justify-content-between">
                                                    <div className="row ">
                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                                                            <div className="card-content">
                                                                <h5 className="font-15">Participantes de <span className="bolder-number"> 1188</span></h5>

                                                                <button onClick={this.handleParticipantes.bind(this,'1188')} className="detail_btn"> Ver Detalles</button>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                                                            <div className="banner-img green">
                                                                <img  alt="Icono Promo" src={sorteo}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>    
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default Dashboard;