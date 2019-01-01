import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import {postSimple} from "../../api/api.js";

const mapStateToProps = state => {
    return{isAdmin: state.user.isAdmin,
		   parent: state.parentTopic,
		   editArticleCB: state.editArticleCB};
};

class EditArticle extends React.Component {
    constructor(props){
        super(props);
        this.state = {title: this.props.article.title,
                      text: this.props.article.text,
                      keywords: this.props.article.keywords,
                      description: this.props.article.description,
                      thumb_img: this.props.article.thumb_img,
                      visible: false}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleVisible = this.toggleVisible.bind(this);
        this.delArticle = this.delArticle.bind(this);
    }
    
    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({[name]: value});
    } 
    
    handleSubmit(event) {
        let cb = this.props.editArticleCB;
        let toggle = this.toggleVisible;
        event.preventDefault();
        const jsonData = {title: this.state.title,
                          text: this.state.text,
                          keywords: this.state.keywords,
                          description: this.state.description,
                          thumb_img: this.state.thumb_img,
                          article_id: this.props.article.article_id}
        postSimple(this.props.apiTarget, jsonData, (err, res) => {
            if(err){
                console.log('Error Trying to change user.');
                console.log(err);
            }else{
                cb();
                toggle();
            }
        })
    }

    toggleVisible(){
        this.setState({visible: !this.state.visible});
    }
    
    delArticle(){
        let cb = this.props.update;
        let toggle = this.toggleVisible;
        let artId = this.props.article.article_id;
        postSimple(this.props.parent+'/remove', {article_id: artId}, function(err, res){
            if(err){
                 window.alert("error deleting user: "+ value);
            }else{
                cb();
                toggle();
          }
        });
    }
    render() {
        let form = null;
        if(this.state.visible){
            form = (
            <form onSubmit={this.handleSubmit} >
                 Title: <input name="title" type="text" value={this.state.title} onChange={this.handleChange} /> <br/>
                 Keywords: <input name="keywords" type="text" value={this.state.keywords} onChange={this.handleChange} /> <br/>
                 Description: <input name="description" type="text" value={this.state.description} onChange={this.handleChange} /><br/>
                 Thumbnail URL: <input name="thumb_img" type="text" value={this.state.thumb_img} onChange={this.handleChange} /><br/>
                 Body:<br/><textarea name="text" type="text" cols="80" rows="20" value={this.state.text} onChange={this.handleChange} /> <br/>
                 <input type="submit" value="submit" />
              </form>
              )
            }
            
        return(
           <div>
              <button onClick={this.delArticle}>Delete Post</button>
              <button onClick={this.toggleVisible}>{this.state.visible ? 'Done' : 'Edit'}</button>
              {form}
           </div>
        )
    }
}
export default connect(mapStateToProps)(EditArticle);
