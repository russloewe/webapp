import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { Provider } from "react-redux";
import EditArticle from './editArticle.jsx';
import FormatDate from '../formatting/date.jsx';

const mapStateToProps = state => {
    return{isAdmin: state.user.isAdmin,
		   parent: state.parentTopic,
		   editArticleCB: state.editArticleCB};
};

function Article(props){
	    let title;
	    let datetext;
        if(props.article.created_on && props.date){
          datetext = FormatDate(props.article.created_on);
        }else{
            datetext = '';
        }
		if(props.title){ title = props.article.title;}
	    else{title = '';}
	    
	    const editbutton = (p) => { 
			return(
				<EditArticle article={p} apiTarget={props.parent+"/edit"} update={props.editArticleCB} />
			)};
				
    return(    
       <div className="article" >
            <h2>{title}</h2>
            <h6>{datetext}</h6><br/>
            <div dangerouslySetInnerHTML={{ __html: props.article.text }}></div>
            {props.isAdmin ? editbutton(props.article) : ''}       
       </div>
        )
}
export default connect(mapStateToProps)(Article);
