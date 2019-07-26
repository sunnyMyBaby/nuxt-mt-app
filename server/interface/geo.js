import Router from 'koa-router'
import City from '../dbs/models/city'
import Axios from './utils/axios'

// 签名
const sign = '0316a3afa7d839a73b88502f0c4e266e'

const router = new Router({
  prefix: '/geo'
})

router.get('/getPosition', async (ctx, next) => {
  // 这里是请求第三方的接口
  const { status, data: { province, city } } = await Axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      code: -1,
      province: '',
      city: ''
    }
  }
})

router.get('/menu', async (ctx) => {
  const { status, data: { menu } } = await Axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})

router.get('/province', async (ctx) => {
  // 本地数据库不全
  // if (ctx.query.id) {
  //   // 按条件检索
  //   const province = await City.findOne({
  //     id: ctx.query.id
  //   })
  //   ctx.body = {
  //     code: 0,
  //     city: province.value.map((item) => {
  //       return { province: item, id: province.id, name: item }
  //     })
  //   }
  // } else {
  //   // 检索全部
  //   const province = await City.find()
  //   ctx.body = {
  //     province: province.map((item) => {
  //       return {
  //         id: item.id,
  //         name: item.value[0]
  //       }
  //     })
  //   }
  // }
  if (ctx.query.id) {
    const {
      status,
      data: {
        city
      }
    } = await Axios.get(`http://cp-tools.cn/geo/province/${ctx.query.id}?sign=${sign}`)
    if (status === 200) {
      ctx.body = {
        city
      }
    } else {
      ctx.body = {
        city: []
      }
    }
  } else {
    const {
      status,
      data: {
        province
      }
    } = await Axios.get(`http://cp-tools.cn/geo/province/?sign=${sign}`)
    ctx.body = {
      province: status === 200
        ? province
        : []
    }
  }
})

router.get('/province/:id', async (ctx) => {
  console.log('ssss')
  // http: //localhost:3333/changeCity/10000 id = 10000
  // let city = await City.findOne({id: ctx.params.id})
  //
  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }
  const {
    status,
    data: {
      city
    }
  } = await Axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

router.get('/city', async (ctx) => {
  // let city = []
  // let result = await City.find()
  // result.forEach(item => {
  //   city = city.concat(item.value)
  // })
  // ctx.body = {
  //   code: 0,
  //   city: city.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
  //         ? item.province
  //         : item.name
  //     }
  //   })
  // }
  const {
    status,
    data: {
      city
    }
  } = await Axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

router.get('/hotCity', async (ctx) => {
  // let list = [
  //   '北京市',
  //   '上海市',
  //   '广州市',
  //   '深圳市',
  //   '天津市',
  //   '西安市',
  //   '杭州市',
  //   '南京市',
  //   '武汉市',
  //   '成都市'
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }
  const {
    status,
    data: {
      hots
    }
  } = await Axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})
export default router
