/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Markdown from 'react-markdown';
import type {
  ArticleSlug,
  Comment as CommentType
} from '../../domain/article';
import { article, type ArticleState } from '../../state/article';
import { type UserState } from '../../state/user';
import TagList from '../tag/TagList';
import ArticleMeta from './ArticleMeta';
import CommentForm from './CommentForm';
import Comment from './Comment';

type Props = {
  articleSlug: ArticleSlug,
  user: UserState,
  article: $PropertyType<ArticleState, 'article'>,
  comments: $PropertyType<ArticleState, 'comments'>,
  error: $PropertyType<ArticleState, 'error'>,
  isLoading: $PropertyType<ArticleState, 'isLoading'>,
  loadArticle: (ArticleSlug) => void,
  addComment: (string, ArticleSlug) => void,
  removeComment: (CommentType, ArticleSlug) => void,
  unloadArticle: Function
};

class Article extends Component<Props> {
  componentDidMount() {
    const {
      loadArticle,
      articleSlug,
      article
    } = this.props;

    if(!article) {
      loadArticle(articleSlug);
    }
  }

  componentWillUnmount() {
    this.props.unloadArticle();
  }

  addComment = (commentBody) => {
    const {
      addComment,
      articleSlug
    } = this.props;

    addComment(commentBody, articleSlug);
  }

  handleClickDeleteComment = (comment) => {
    const {
      removeComment,
      articleSlug
    } = this.props;

    removeComment(comment, articleSlug);
  }

  render() {
    const {
      user,
      article, comments,
      isLoading, error
    } = this.props;

    if(error) {
      return <Redirect to="/" />;
    }

    if(isLoading || !article) {
      return null;
    }

    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">
            <h1>{ article.title }</h1>

            <ArticleMeta article={ article } currentUser={ user } />
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <Markdown source={ article.body } />
              <TagList
                tags={ article.tagList }
                tagClassName="tag-outline"
              />
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <ArticleMeta article={ article } currentUser={ user } />
          </div>

          <div className="row">

            <div className="col-xs-12 col-md-8 offset-md-2">

              {
                user && (
                  <CommentForm
                    currentUser={ user }
                    onSubmit={ this.addComment }
                  />
                )
              }

              {
                comments.map((comment) =>
                  <Comment
                    key={ comment.id }
                    comment={ comment }
                    currentUser={ user }
                    onClickDelete={ this.handleClickDeleteComment }
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ article, user }, props) => ({
  user,
  article: article.article,
  comments: article.comments,
  isLoading: article.isLoading,
  error: article.error,
  articleSlug: props.match.params.slug
});

const mapDispatchToProps = {
  loadArticle: article.loadArticle,
  addComment: article.addComment,
  removeComment: article.removeComment,
  unloadArticle: article.unloadArticle
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
