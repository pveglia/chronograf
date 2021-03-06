import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import classnames from 'classnames'
import OnClickOutside from 'shared/components/OnClickOutside'
import FancyScrollbar from 'shared/components/FancyScrollbar'
import {
  DROPDOWN_MENU_MAX_HEIGHT,
  DROPDOWN_MENU_ITEM_THRESHOLD,
} from 'shared/constants/index'

class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      searchTerm: '',
      filteredItems: this.props.items,
      highlightedItemIndex: null,
    }

    this.handleClickOutside = ::this.handleClickOutside
    this.handleClick = ::this.handleClick
    this.handleSelection = ::this.handleSelection
    this.toggleMenu = ::this.toggleMenu
    this.handleAction = ::this.handleAction
    this.handleFilterChange = ::this.handleFilterChange
    this.applyFilter = ::this.applyFilter
    this.handleFilterKeyPress = ::this.handleFilterKeyPress
    this.handleHighlight = ::this.handleHighlight
  }

  static defaultProps = {
    actions: [],
    buttonSize: 'btn-sm',
    buttonColor: 'btn-info',
    menuWidth: '100%',
    useAutoComplete: false,
  }

  handleClickOutside() {
    this.setState({isOpen: false})
  }

  handleClick(e) {
    this.toggleMenu(e)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  handleSelection(item) {
    this.toggleMenu()
    this.props.onChoose(item)
  }

  handleHighlight(itemIndex) {
    this.setState({highlightedItemIndex: itemIndex})
  }

  toggleMenu(e) {
    if (e) {
      e.stopPropagation()
    }
    if (!this.state.isOpen) {
      this.setState({
        searchTerm: '',
        filteredItems: this.props.items,
        highlightedItemIndex: null,
      })
    }
    this.setState({isOpen: !this.state.isOpen})
  }

  handleAction(e, action, item) {
    e.stopPropagation()
    action.handler(item)
  }

  handleFilterKeyPress(e) {
    const {filteredItems, highlightedItemIndex} = this.state

    if (e.key === 'Enter' && filteredItems.length) {
      this.setState({isOpen: false})
      this.props.onChoose(filteredItems[highlightedItemIndex])
    }
    if (e.key === 'Escape') {
      this.setState({isOpen: false})
    }
    if (e.key === 'ArrowUp' && highlightedItemIndex > 0) {
      this.setState({highlightedItemIndex: highlightedItemIndex - 1})
    }
    if (e.key === 'ArrowDown') {
      if (highlightedItemIndex < filteredItems.length - 1) {
        this.setState({highlightedItemIndex: highlightedItemIndex + 1})
      }
      if (highlightedItemIndex === null && filteredItems.length) {
        this.setState({highlightedItemIndex: 0})
      }
    }
  }

  handleFilterChange(e) {
    if (e.target.value === null || e.target.value === '') {
      this.setState({
        searchTerm: '',
        filteredItems: this.props.items,
        highlightedItemIndex: null,
      })
    } else {
      this.setState({searchTerm: e.target.value}, () =>
        this.applyFilter(this.state.searchTerm)
      )
    }
  }

  applyFilter(searchTerm) {
    const {items} = this.props
    const filterText = searchTerm.toLowerCase()
    const matchingItems = items.filter(item =>
      item.text.toLowerCase().includes(filterText)
    )

    this.setState({
      filteredItems: matchingItems,
      highlightedItemIndex: 0,
    })
  }

  renderShortMenu() {
    const {
      actions,
      addNew,
      items,
      menuWidth,
      menuLabel,
      useAutoComplete,
      selected,
    } = this.props
    const {filteredItems, highlightedItemIndex} = this.state
    const menuItems = useAutoComplete ? filteredItems : items

    return (
      <ul
        className={classnames('dropdown-menu', {
          'dropdown-menu--no-highlight': useAutoComplete,
        })}
        style={{width: menuWidth}}
      >
        {menuLabel ? <li className="dropdown-header">{menuLabel}</li> : null}
        {menuItems.map((item, i) => {
          if (item.text === 'SEPARATOR') {
            return <li key={i} role="separator" className="divider" />
          }
          return (
            <li
              className={classnames('dropdown-item', {
                highlight: i === highlightedItemIndex,
                active: item.text === selected,
              })}
              key={i}
            >
              <a
                href="#"
                onClick={() => this.handleSelection(item)}
                onMouseOver={() => this.handleHighlight(i)}
              >
                {item.text}
              </a>
              {actions.length > 0
                ? <div className="dropdown-item__actions">
                    {actions.map(action => {
                      return (
                        <button
                          key={action.text}
                          className="dropdown-item__action"
                          onClick={e => this.handleAction(e, action, item)}
                        >
                          <span
                            title={action.text}
                            className={`icon ${action.icon}`}
                          />
                        </button>
                      )
                    })}
                  </div>
                : null}
            </li>
          )
        })}
        {addNew
          ? <li className="dropdown-item">
              <Link to={addNew.url}>
                {addNew.text}
              </Link>
            </li>
          : null}
      </ul>
    )
  }

  renderLongMenu() {
    const {
      actions,
      addNew,
      items,
      menuWidth,
      menuLabel,
      useAutoComplete,
      selected,
    } = this.props
    const {filteredItems, highlightedItemIndex} = this.state
    const menuItems = useAutoComplete ? filteredItems : items

    return (
      <ul
        className={classnames('dropdown-menu', {
          'dropdown-menu--no-highlight': useAutoComplete,
        })}
        style={{width: menuWidth, height: DROPDOWN_MENU_MAX_HEIGHT}}
      >
        <FancyScrollbar autoHide={false}>
          {menuLabel ? <li className="dropdown-header">{menuLabel}</li> : null}
          {menuItems.map((item, i) => {
            if (item.text === 'SEPARATOR') {
              return <li key={i} role="separator" className="divider" />
            }
            return (
              <li
                className={classnames('dropdown-item', {
                  highlight: i === highlightedItemIndex,
                  active: item.text === selected,
                })}
                key={i}
              >
                <a
                  href="#"
                  onClick={() => this.handleSelection(item)}
                  onMouseOver={() => this.handleHighlight(i)}
                >
                  {item.text}
                </a>
                {actions.length > 0
                  ? <div className="dropdown-item__actions">
                      {actions.map(action => {
                        return (
                          <button
                            key={action.text}
                            className="dropdown-item__action"
                            onClick={e => this.handleAction(e, action, item)}
                          >
                            <span
                              title={action.text}
                              className={`icon ${action.icon}`}
                            />
                          </button>
                        )
                      })}
                    </div>
                  : null}
              </li>
            )
          })}
          {addNew
            ? <li>
                <Link to={addNew.url}>
                  {addNew.text}
                </Link>
              </li>
            : null}
        </FancyScrollbar>
      </ul>
    )
  }

  render() {
    const {
      items,
      selected,
      className,
      iconName,
      buttonSize,
      buttonColor,
      useAutoComplete,
    } = this.props
    const {isOpen, searchTerm, filteredItems} = this.state
    const menuItems = useAutoComplete ? filteredItems : items

    return (
      <div
        onClick={this.handleClick}
        className={classnames(`dropdown ${className}`, {open: isOpen})}
      >
        {useAutoComplete && isOpen
          ? <div
              className={`dropdown-autocomplete dropdown-toggle ${buttonSize} ${buttonColor}`}
            >
              <input
                ref="dropdownAutoComplete"
                className="dropdown-autocomplete--input"
                type="text"
                autoFocus={true}
                placeholder="Filter items..."
                spellCheck={false}
                onChange={this.handleFilterChange}
                onKeyDown={this.handleFilterKeyPress}
                value={searchTerm}
              />
              <span className="caret" />
            </div>
          : <div className={`btn dropdown-toggle ${buttonSize} ${buttonColor}`}>
              {iconName
                ? <span className={classnames('icon', {[iconName]: true})} />
                : null}
              <span className="dropdown-selected">{selected}</span>
              <span className="caret" />
            </div>}
        {isOpen && menuItems.length < DROPDOWN_MENU_ITEM_THRESHOLD
          ? this.renderShortMenu()
          : null}
        {isOpen && menuItems.length >= DROPDOWN_MENU_ITEM_THRESHOLD
          ? this.renderLongMenu()
          : null}
        {isOpen && !menuItems.length
          ? <ul className="dropdown-menu">
              <li className="dropdown-empty">No matching items</li>
            </ul>
          : null}
      </div>
    )
  }
}

const {arrayOf, bool, shape, string, func} = PropTypes

Dropdown.propTypes = {
  actions: arrayOf(
    shape({
      icon: string.isRequired,
      text: string.isRequired,
      handler: func.isRequired,
    })
  ),
  items: arrayOf(
    shape({
      text: string.isRequired,
    })
  ).isRequired,
  onChoose: func.isRequired,
  onClick: func,
  addNew: shape({
    url: string.isRequired,
    text: string.isRequired,
  }),
  selected: string.isRequired,
  iconName: string,
  className: string,
  buttonSize: string,
  buttonColor: string,
  menuWidth: string,
  menuLabel: string,
  useAutoComplete: bool,
}

export default OnClickOutside(Dropdown)
