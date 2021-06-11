import React, { Component } from 'react';

import './css/Style.css';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'font-awesome/css/font-awesome.min.css';
import swal from 'sweetalert';

import config from '../../config/config';
import axios from "axios";

//Imagenes
import logo from './images/logo.svg';
import botella from './images/lata.png';

//Axios
console.log(config.backURL);
const axiosInstance = axios.create({
    baseURL: config.backURL
});

//Validaciones REGEX
const validEmailRegex = RegExp(
    /^(([^<>(),;:\s@]+(\.[^<>();:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+\.)+[^<>()[\],;:\s@]{2,})$/i
);

const validPhone = RegExp(
    /^[04|02]{2}([\d]{2}[-]*){3}[\d]{3}$/
);

const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class Inicio extends Component {

    constructor(props)
    {
        super(props);
        this.state={display:'none', name:'', cedula:'', ubicacion:'', telefono:'', email:'',
            errors: {
                name:'',
                cedula:'',
                ubicacion:'',
                email:'',
                telefono:''
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value =  target.value;
        const name = target.name;
    
        this.setState({
        [name]: value
        });

        //Validaciones
        let errors = this.state.errors;
    
        switch (name) {
            case 'name': 
                errors.name = 
                value.length === 0
                    ? 'Favor ingresar un nombre válido.'
                    : '';
            break;

            case 'email': 
                errors.email = 
                    validEmailRegex.test(value)
                    ? ''
                    : 'Correo electrónico inválido.';
            break;

            case 'ubicacion': 
                errors.ubicacion = 
                value.length === 0
                    ? 'Favor ingresar ubicación.'
                    : '';
            break;

            case 'cedula':
                errors.cedula =
                value.length > 6
                ? ''
                : 'Favor ingresar una cédula o RIF válido.';
            break;

            case 'telefono':
                errors.telefono =
                    validPhone.test(value)
                    ? ''
                    : 'Ingrese un número de telefóno válido.';
            break;

            default:
            break;
        }
    }

    handleSubmit(e){
        e.preventDefault();
        if(!this.state.name || !this.state.email || !this.state.telefono || !this.state.cedula || !this.state.ubicacion){
            swal('Formulario Incompleto', 'Favor rellene los datos indicados para enviar su solicitud', 'warning');
        }
        else{
            if(validateForm(this.state.errors)) {
                this.setState({display:'flex'});
                axiosInstance.post('/sendParticipacion', {
                    'name' : this.state.name,
                    'email': this.state.email,
                    'phone': this.state.telefono,
                    'cedula': this.state.cedula, 
                    'ubicacion': this.state.ubicacion
                }).then(res => {
                    this.setState({display:'none'});
                    swal('¡Gracias por participar con EFES!', 'Pronto anunciaremos los ganadores', 'success');
                    this.resetForm();

                }).catch((error) => {
                    console.log(error);
                    this.setState({display:'none'});
                    swal('Ha ocurrido un error', 'Favor intente nuevamente', 'warning');
                    console.log(error);
                })
            }
        }
    }

    resetForm(){
        this.setState({
            name:'', 
            cedula:'', 
            ubicacion:'', 
            telefono:'', 
            email:''
        })
    }  

    render(){
        const {errors} = this.state;
        return(
            <div className="">
                <div className="loader-page" style={{display: this.state.display}}>
                    <div className="lds-ripple"><div></div><div></div></div>
                </div>

                <div className="header">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <div className="navbar-collapse" id="navbarNav">
                                
                                <ul className="navbar-nav mx-auto">
                                  
                                    <img src={logo} className="img-responsive" width="100px" height="100px" alt=""/>
                                
                                    <li className="nav-item active">
                                        <h1 className="tittle_page padd-top padd-left" href="#">EFES</h1>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>

                <section id="banner" className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="banner-info">
                                <img className="img-fluid" src={botella} alt="Cerveza EFES"></img>
                                <div className="banner-logo text-center">
                                </div>
                                <div className="banner-text">
                                    <h1 className="yellow bolder text-principal phone-size">GANA <span className="white">1</span></h1>
                               
                                    <div className="text-2">
                                        <h2 className="white">DE <span className="yellow bolder">NUESTROS</span></h2>
                                        <h2 className="white none-bold text-second">PREMIOS</h2>
                                    </div>

                                    
                                    <div className="btn">
                                        <button className="btn_form">PARTICIPAR</button>
                                    </div>
                                </div>

                            </div>

                            
                        </div>
                    </div>
                </section>

                <section className="formulario">
                    <div className="container">
                        <div className="col-md-6 col-xs-12">
                            <h1>PREMIOS</h1>
                            <div className="premios col-12">
                            </div>

                            <div className="premios col-12">
                            </div>

                            <div className="premios col-12">
                            </div>

                        </div>

                        <div className="col-md-6 col-xs-12 formulario-form">
                            <h1>¿QUIERES GANAR? <br></br> PARTICIPA</h1>

                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input name="name" maxLength="20" type="text" className="formControl" placeholder="Nombre y Apellido" value={this.state.name}
                                    onChange={this.handleChange}></input>
                                    {errors.name.length > 0 && 
                                    <span className='error'>{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <input name="cedula" maxLength="35" type="tel" className="formControl" placeholder="Cédula" value={this.state.cedula}
                                    onChange={this.handleChange}></input>
                                    {errors.cedula.length > 0 && 
                                    <span className='error'>{errors.cedula}</span>}
                                </div>

                                <div className="form-group">
                                    <input name="ubicacion" maxLength="35" type="text" className="formControl" placeholder="Ubicación corta" value={this.state.ubicacion}
                                    onChange={this.handleChange}></input>
                                    {errors.ubicacion.length > 0 && 
                                    <span className='error'>{errors.ubicacion}</span>}
                                </div>


                                <div className="form-group">
                                    <input name="telefono" maxLength="11" type="phone" className="formControl" placeholder="Número de Telefono" value={this.state.telefono}
                                    onChange={this.handleChange}></input>
                                    {errors.telefono.length > 0 && 
                                    <span className='error'>{errors.telefono}</span>}
                                </div>

                                <div className="form-group">
                                    <input name="email" maxLength="35" type="email" className="formControl" placeholder="E-mail" value={this.state.email}
                                    onChange={this.handleChange}></input>
                                    {errors.email.length > 0 && 
                                    <span className='error'>{errors.email}</span>}
                                </div>



                                <button className="btn_form">ENVIAR</button>
                                
                            </form>
                        </div>
                    </div>

                </section>
            </div>
        )
    }
}
export default Inicio;