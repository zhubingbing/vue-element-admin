import request from '@/utils/requestdevops'

export function getList() {
  return request({
    url: '/openstack/servers/',
    method: 'get'
  })
}

export function getNetworks() {
  return request({
    url: '/openstack/networks/',
    method: 'get'
  })
}

export function getFlavor() {
  return request({
    url: '/openstack/servers/flavor',
    method: 'get'
  })
}

export function getKey() {
  return request({
    url: '/openstack/servers/key',
    method: 'get'
  })
}

export function getZone() {
  return request({
    url: '/openstack/servers/zone',
    method: 'get'
  })
}

export function createServer(instance) {
  return request({
    url: '/openstack/servers/',
    method: 'post',
    data: { instance }
  })
}

export function getImage() {
  return request({
    url: '/openstack/servers/image',
    method: 'get'
  })
}

export function getHypervisor() {
  return request({
    url: '/openstack/os-hypervisors',
    method: 'get'
  })
}

export function getServer(uuid) {
  return request({
    url: '/openstack/servers/server',
    method: 'get',
    params: { uuid }
  })
}

export function getAlerts() {
  return request({
    url: '/promethues/alerts',
    method: 'get'
  })
}
