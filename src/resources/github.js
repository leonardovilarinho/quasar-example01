import Client from './config'

export const repositores = (owner) => {
  return Client.get(`orgs/${owner}/repos`)
}

export const commits = (owner) => {
  return Client.get(`repos/${owner}/commits`)
}
