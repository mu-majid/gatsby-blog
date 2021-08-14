/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// Hijacking the build and attaching a slug field to MD nodes
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` }) // Slug is link to blog post
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

// Create page for each post from the respective MD file
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  // Remember () is required when using gql with Nodejs
  return graphql(`
     {
       allMarkdownRemark {
         edges {
           node {
             fields {
               slug
             }
           }
         }
       }
     }
   `).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: {
          slug: node.fields.slug,
        },
      })
    })
  })
}
