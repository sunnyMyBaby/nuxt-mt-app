import Router from 'koa-router'
import Poi from '../dbs/models/poi'
import Axios from './utils/axios'
const router = new Router({
  prefix: '/search'
})

const sign = '0316a3afa7d839a73b88502f0c4e266e'

router.get('/top', async (ctx) => {
  // const data = await Poi.find({ input: ctx.query.input, city: ctx.query.city })
  // ctx.body = {
  //   top: data
  // }
  const { status, data: { top } } = await Axios.get('http://cp-tools.cn/search/top', {
    params: {
      input: ctx.query.input,
      city: ctx.query.city,
      sign
    }
  })
  ctx.body = {
    top: status === 200 ? top : []
  }
})
router.get('/hotPlace', async (ctx) => {
  // let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  // try {
  //   let result = await Poi.find({
  //     city,
  //     type: ctx.query.type || '景点'
  //   }).limit(10)
  //
  //   ctx.body = {
  //     code: 0,
  //     result: result.map(item => {
  //       return {
  //         name: item.name,
  //         type: item.type
  //       }
  //     })
  //   }
  // } catch (e) {
  //   ctx.body = {
  //     code: -1,
  //     result: []
  //   }
  // }
  const city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  const { status, data: { result } } = await Axios.get(`http://cp-tools.cn/search/hotPlace`, {
    params: {
      sign,
      city
    }
  })
  ctx.body = {
    result: status === 200
      ? result
      : []
  }
})

router.get('/resultsByKeywords', async (ctx) => {
  const { city, keyword } = ctx.query
  const { status, data: { count, pois } } = await Axios.get('http://cp-tools.cn/search/resultsByKeywords', {
    params: {
      city,
      keyword,
      sign
    }
  })
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200
      ? pois
      : []
  }
})
export default router
