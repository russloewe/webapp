import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { Provider } from "react-redux";
import FormatDate from "../formatting/date.jsx";

const mapStateToProps = state => {
    return{isAdmin: state.user.isAdmin,
		   parent: state.parentTopic,
		   editArticleCB: state.editArticleCB};
};

function ArticleStub(props){
	    let title;
	    let datetext;
        let img;
        if(props.article.created_on && props.date){
          datetext = FormatDate(props.article.created_on);
        }else{
            datetext = '';
        }
	    if(props.image){
            img = <img src={props.article.thumb_img} />;
        }else{
            img = '';
        }

    return(    
        <a href={props.parent+"/post/"+props.article.article_id+'/'+props.article.title} >
            <div className="article-stub">
                {img}
                <h3>{props.article.title}</h3>
                <h6>{datetext}</h6>
                <p>{props.article.description}</p>
            </div>
        </a>         
        )
}
export default connect(mapStateToProps)(ArticleStub);
