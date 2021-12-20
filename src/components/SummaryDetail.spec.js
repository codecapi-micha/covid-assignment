import { mount } from '@vue/test-utils'
import SummaryDetail from './SummaryDetail.vue'

describe('SummaryDetail', () => {
  const wrapper = mount(SummaryDetail, {
    props: {
      label: 'Component label',
      labelA: 'LabelA',
      labelB: 'LabelB',
      casesA: 230,
      casesB: 145,
      deathsA: 2,
      deathsB: 45,
    },
  })
  it('should mount successfully with label', () => {
    expect(wrapper.text()).toContain('Component label')
  })
  it('should mount successfully with label A', () => {
    expect(wrapper.text()).toContain('LabelA')
  })
  it('should mount successfully with label B', () => {
    expect(wrapper.text()).toContain('LabelB')
  })

  it('should have a difference of 85 for the cases', () => {
    expect(wrapper.find('[data-test="cases-indicator"]').text()).toBe('+ 85')
  })

  it('should have a difference of 43 for the deaths', () => {
    expect(wrapper.find('[data-test="deaths-indicator"]').text()).toBe('-43')
  })

  it('should have the correct class for the cases', () => {
    expect(wrapper.find('[data-test="cases-indicator"]').classes()).toContain(
      'trend--is-positive'
    )
  })
  it('should have the correct class for the deaths', () => {
    expect(wrapper.find('[data-test="deaths-indicator"]').classes()).toContain(
      'trend--is-negative'
    )
  })
})
