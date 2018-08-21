export function mapStateToProps(state) {
  return {
    item: state.search.clickedItem,
  }
}
