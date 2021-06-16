import React, { Component } from 'react';

import './css/Login.css';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import 'font-awesome/css/font-awesome.min.css';
import swal from 'sweetalert';

import {fire} from './config/firebase';

import {Redirect} from 'react-router-dom';

//Validaciones REGEX
const validEmailRegex = RegExp(
    /^(([^<>(),;:\s@]+(\.[^<>();:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+\.)+[^<>()[\],;:\s@]{2,})$/i
);


const validateFormLogin = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class Login extends Component {

    constructor(props)
    {
        super(props);
        this.state={display:'none', emailLG:'', passwordLG:'',
            errorsLG:{
                emailLG: '',
                passwordLG: ''
            }
        }
        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    }

    handleChangeLogin(event) {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
    
        this.setState({
        [name]: value
        });

        //Validaciones
        let errorsLG = this.state.errorsLG;

        switch (name) {
            
            case 'emailLG': 
            errorsLG.emailLG = 
                validEmailRegex.test(value)
                ? ''
                : 'Correo electrónico inválido.';
            break;

            case 'passwordLG':
                errorsLG.passwordLG =
                value.length > 5
                ? ''
                : "Contraseña mayor o igual a 6 caracteres." 
            
            break;

            default:

        }

    }

    handleSubmitLogin(event){
        console.log(this.state.emailLG);
        event.preventDefault();
        if(!this.state.emailLG || !this.state.passwordLG){
            swal('Rellene todas los campos antes de Iniciar Sesión','', 'error');
        }
        else{
            if(validateFormLogin(this.state.errorsLG)) {
                this.login(event);
                
            }else{
                console.error('Invalid Form')
                swal('Favor verifique que todos los campos esten completado','','error');
            }
        }

        
    }

    login(e){
        this.setState({display:'flex'});
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.emailLG, this.state.passwordLG).then((u) =>{
            this.setState({display:'none'});
            swal('¡Inicio de sesión exitoso!','','success');
            this.setState({redirect:true});
            this.resetForm();
        }).catch((err)=>{
            switch (err.code){
                case "auth/invalid-email":
                    this.setState({display:'none'});
                    swal('El valor de email no es válido, debe ser una dirección de correo electrónico','','error');
                break;

                case "auth/user-disabled":
                    this.setState({display:'none'});
                    swal('La cuenta se encuentra desactivada','' ,'error');
                break;

                case "auth/argument-error":
                    this.setState({display:'none'});
                    swal('Campos vacios, favor rellenar antes de iniciar sesión','','error');
                break;

                case "auth/user-not-found":
                    this.setState({display:'none'});
                    swal('No existe ningún usuario que corresponda con los datos ingresados','','error');
                break;

                case "auth/wrong-password":
                    this.setState({display:'none'});
                    swal('La contraseña es incorrecta. Vuelve a intentarlo','','error');
                break;

                default:
                    this.setState({display:'none'}); 
                    swal('Ha ocurrido un error, intente más tarde','','error');
            }
        })
    }

    resetForm(){
        this.setState({
            emailLG: '',
            passwordLG: ''
        })
    }
    
    setRedirect = () =>{
        this.setState({ redirect: true})
    }
  

    renderRedirect =() =>{
        if(this.state.redirect){
          return <Redirect to='/DashboardAdmin'/>
        }
    }



    render(){
        return(
            <div class="limiter">

                <div className="loader-page" style={{display: this.state.display}}>
                    <div className="lds-ripple"><div></div><div></div></div>
                </div>

                {this.renderRedirect()}

                <div class="container-login100">
                    <div class="wrap-login100">
                        <form class="login100-form validate-form" onSubmit={this.handleSubmitLogin}>
                            <span class="login100-form-logo">
                                <i class="fa fa-user"></i>
                            </span>
        
                            <span class="login100-form-title p-b-34 p-t-27">
                                Iniciar Sesión
                            </span>
        
                            <div class="wrap-input100 validate-input" data-validate = "Enter username">
                                <input class="input100" type="email" name="emailLG" placeholder="Email" value={this.state.emailLG} onChange={this.handleChangeLogin}/>
                                <span class="focus-input100 focus-user" data-placeholder="&#xf207;"></span>
                            </div>

        
                            <div class="wrap-input100 validate-input" data-validate="Enter password">
                                <input class="input100" type="password" name="passwordLG" placeholder="Contraseña" value={this.state.passwordLG} onChange={this.handleChangeLogin}  />
                                <span class="focus-input100 focus-pass" data-placeholder="&#xf191;"></span>
                            </div>
        
                            <div class="container-login100-form-btn">
                                <button type="submit" className="login100-form-btn">
                                    Login
                                </button>
                            </div>
        

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login;