import React,{useState} from 'react';
import { DropdownButton,MenuItem,ButtonToolbar } from 'react-bootstrap';
import PopRenderMap from './../../components/populationMap';
import './../../css/literacyMap.css';

class Dashboard extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      population:"medium",
      active:"medium",
      risk:"medium"
    };
    this.BUTTONS=[
      {type:'primary',label:'Population'},
      {type:'danger',label:'Active Cases'},
      {type:'success',label:'Risk Score'},
    ];
    this.handleClick=this.handleClick.bind(this);
    this.renderDropdownButton=this.renderDropdownButton.bind(this);
  }
  handleClick (d){
    let allNodes=d.target.parentElement.parentElement.querySelectorAll("li");
    allNodes.forEach((y)=>{y.classList.remove("active")});
    if (d.target.id=='Population'){
      this.setState({population:d.target.textContent.toLowerCase()});
      d.target.parentElement.classList.add("active");
    }
    
    if (d.target.id=='Active Cases'){
      this.setState({active:d.target.textContent.toLowerCase()});
      d.target.parentElement.classList.add("active")
    }
    
    if (d.target.id=='Risk Score'){
      this.setState({risk:d.target.textContent.toLowerCase()});
      d.target.parentElement.classList.add("active")
    }
  }
  renderDropdownButton(title, i) {
    return (
      <DropdownButton
        bsStyle={i.toLowerCase()}
        title={title}
        key={i}
        id={`dropdowna`}
      >
        <MenuItem eventKey="2" id= {title} onClick={this.handleClick} active>Medium</MenuItem>
        <MenuItem eventKey="1" id= {title}   onClick={this.handleClick}>High</MenuItem>
        <MenuItem eventKey="3" id= {title}  onClick={this.handleClick}>Low</MenuItem>
      </DropdownButton>
    );
  }
  render() {
    return(
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <PopRenderMap state={this.state} />
          </div>
          <div className="col-md-4">
            <ButtonToolbar>{this.BUTTONS.map(button => this.renderDropdownButton(button.label,button.type))}</ButtonToolbar>
          </div>
          {/* <div className="col-md-8">
            <SalesChart />
          </div> */}
        </div>
        {/* <div className="row">
          <div className="col-md-6">
            <UserBehaviorChart />
          </div>
          <div className="col-md-6">
            <Tasks />
          </div>
        </div> */}
  
      </div>
    </div>);
  };
}
// // function changeColor()
// var state={
//   population:"medium",
//   active:"medium",
//   risk:"medium"
// }
// function handleClick (d){
//   if (d.target.id=='Population'){
//     state.population=d.target.textContent.toLowerCase();
//   }
  
//   if (d.target.id=='Active Cases'){
//     state.active=d.target.textContent.toLowerCase();
//   }
  
//   if (d.target.id=='Risk Score'){
//     state.risk=d.target.textContent.toLowerCase();
//   }
//   console.log(state);
// }
// const BUTTONS=[
//   {type:'primary',label:'Population'},
//   {type:'danger',label:'Active Cases'},
//   {type:'success',label:'Risk Score'},
// ]
// function renderDropdownButton(title, i) {
//   return (
//     <DropdownButton
//       bsStyle={i.toLowerCase()}
//       title={title}
//       key={i}
//       id={`dropdowna`}
//     >
//       <MenuItem eventKey="1" id= {title}   onClick={handleClick}>High</MenuItem>
//       <MenuItem eventKey="2" id= {title} onClick={handleClick} active>Medium</MenuItem>
//       <MenuItem eventKey="3" id= {title}  onClick={handleClick}> Low</MenuItem>
//     </DropdownButton>
//   );
// }
// const Dashboard = () => (
//   <div className="content">
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-4">
//           <PopRenderMap state={state} />
//         </div>
//         <div className="col-md-4">
//           <ButtonToolbar>{BUTTONS.map(button => renderDropdownButton(button.label,button.type))}</ButtonToolbar>
//         </div>
//         {/* <div className="col-md-8">
//           <SalesChart />
//         </div> */}
//       </div>
//       {/* <div className="row">
//         <div className="col-md-6">
//           <UserBehaviorChart />
//         </div>
//         <div className="col-md-6">
//           <Tasks />
//         </div>
//       </div> */}

//     </div>
//   </div>
// );

export default Dashboard;