import request from '@/utils/requestdevops'
export function getImage() {
  return request({
    url: '/openstack/servers/image',
    method: 'get'
  })
}

