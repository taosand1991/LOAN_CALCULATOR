import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'fontawesome/index.js';
import Joi from 'joi-browser'

class Todo extends Component {
    constructor(props){
        super(props);

    this.state = {
        account:{ principal:'', annualRate:'', noOfPayment: '', },
        errors:{},
        mortgagePayment:'',
        loading:false,
    }

    };
    handleChange =(e)=>{
        const account = {...this.state.account};
        account[e.target.name] = e.target.value;
        this.setState({account});
    };
    handleData =()=>{
       const {principal, noOfPayment, annualRate } = this.state.account;
        const monthInterestRate = annualRate/12/100;
        const paymentNumber = noOfPayment * 12;
        const mortgagePayment = ((principal * monthInterestRate * Math.pow(1 + monthInterestRate, paymentNumber))/
            (Math.pow(1 + monthInterestRate, paymentNumber)-1)).toFixed(2);

        this.setState({mortgagePayment});



    };
    schema = {
        principal: Joi.number().required().label('Principal'),
        annualRate: Joi.number().required().label('Annual Rate'),
        noOfPayment: Joi.number().required().label('number of payment')
    };


    handleSubmit =(e)=>{
        const {loading} = this.state;
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors:errors || {}});
         this.handleData();
         const account = {...this.state.account};
        account[e.target.name] = '';
        this.setState({account:{annualRate:'', principal:'', noOfPayment:''}});
        this.setState({loading:true})
    setTimeout(() =>{
       this.setState({loading:false})
    },1000)

    };

    validate = ()=>{
    const result = Joi.validate(this.state.account, this.schema, {abortEarly: false});
        if(!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors
       };

    render() {
    const {errors,loading} = this.state;
        return (
           <React.Fragment>
               <div className='row mt-3'>
                   <div className='col-xl-6 offset-xl-3'>
            <div className='d-flex flex-column bd-highlight mb-3 card card-body'>
                <h4 className='text-center mb-3 bg-success text-white'>LOAN CALCULATOR</h4>
                <form onSubmit={this.handleSubmit} className='form-group'>
                    {loading && <span className='fa fa-refresh fa-spin'/>}
                    <div className='form-group input-group mb-2'>
                        <div className="input-group-prepend">
                            <div className="input-group-text bg-danger text-white">$</div>
                        </div>
                <input onChange={this.handleChange} className='form-control' type="text"
                       placeholder={'Enter your Loan Amount'} name='principal' value={this.state.account.principal}
                />
                {errors.principal && <div className='alert alert-danger input-group'>{errors.principal}</div>}
                </div>
                    <div className='form-group input-group mb-2'>
                        <div className="input-group-prepend">
                            <div className="input-group-text bg-danger text-white">%</div>
                        </div>
                <input onChange={this.handleChange} className='form-control' type="text"
                       placeholder={'Enter your Annual rate'} name={'annualRate'} value={this.state.account.annualRate}
                />
                {errors.annualRate &&
               <div className='alert alert-danger input-group'>{errors.annualRate}</div>}
                </div>
                    <div className='form-group input-group mb-2'>
                        <div className='input-group-prepend'>
                            <div className="input-group-text bg-danger text-white">Yrs</div>
                        </div>
                        <input onChange={this.handleChange} className='form-control' type="text"
                               placeholder={'Period'} name={'noOfPayment'} value={this.state.account.noOfPayment}
                        />
                        {errors.noOfPayment &&
               <div className='alert alert-danger input-group'>{errors.noOfPayment}</div>}
                </div>
                    <button className='btn btn-primary btn-block'>Check
                        {loading && <span className='fa fa-refresh fa-spin'/>}
                    </button>
                    </form>
                <h5 className='text-center'>Your Monthly Mortgage Payment</h5>
                <form >
                    <div className='form-group input-group mb-2'>
                        <div className='input-group-prepend'>
                        <div className='input-group-text'>$</div>
                            </div>
                        <input onChange={this.handleChange} className='form-control' type="text" placeholder='Monthly Mortgage Payment'
                               value={this.state.mortgagePayment} disabled={this.state.mortgagePayment === '' || null}/>
                    </div>
                </form>
                </div>
                </div>

            </div>
               </React.Fragment>
        );
    }
}

export default Todo;
